<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesPermisosController extends Controller
{
    private $guardName = 'api';

    /**
     * 1. Obtener todos los roles.
     * GET /api/roles
     */

    public function index()
    {
        $roles = Role::where('guard_name', $this->guardName)
            ->withCount('permissions')
            ->orderBy('name')
            ->get()
            ->map(function ($rol) {

                return [
                    'id' => $rol->id,
                    'name' => $rol->name,
                    'guard_name' => $rol->guard_name,

                    'created_at' => $rol->created_at
                        ? $rol->created_at->format('Y-m-d H:i:s')
                        : null,

                    'updated_at' => $rol->updated_at
                        ? $rol->updated_at->format('Y-m-d H:i:s')
                        : null,

                    'permissions_count' => $rol->permissions_count,
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Roles obtenidos correctamente.',
            'data' => $roles
        ], 200);
    }


    /**
     * 2. Obtener todos los permisos y los asignados a un rol.
     * GET /api/roles/{id}/permisos
     */
    public function show($id)
    {
        $rol = Role::where('guard_name', $this->guardName)
            ->with('permissions')
            ->findOrFail($id);

        $todosLosPermisos = Permission::where(
            'guard_name',
            $this->guardName
        )
            ->orderBy('name')
            ->get()
            ->map(function ($permiso) {
                $partes = explode('.', $permiso->name);

                return [
                    'id' => $permiso->id,
                    'name' => $permiso->name,
                    'modulo' => $partes[0] ?? null,
                    'accion' => $partes[1] ?? null,
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Permisos del rol obtenidos correctamente.',
            'data' => [
                'rol' => $rol->only(['id', 'name']),
                'permisos' => $todosLosPermisos,
                'permisos_asignados' => $rol->permissions
                    ->pluck('name')
                    ->values()
            ]
        ], 200);
    }

    /**
     * 3. Actualizar los permisos de un rol.
     * PUT /api/roles/{id}/permisos
     */
    public function update(Request $request, $id)
    {
        $rol = Role::where('guard_name', $this->guardName)
            ->findOrFail($id);

        $datos = $request->validate([
            'permisos' => ['required', 'array'],
            'permisos.*' => [
                'required',
                'string',
                'distinct',
                Rule::exists('permissions', 'name')
                    ->where('guard_name', $this->guardName),
            ],
        ]);

        $permisos = Permission::where(
            'guard_name',
            $this->guardName
        )
            ->whereIn('name', $datos['permisos'])
            ->get();

        $rol->syncPermissions($permisos);

        app()[PermissionRegistrar::class]
            ->forgetCachedPermissions();

        return response()->json([
            'success' => true,
            'message' => 'Permisos actualizados correctamente.',
            'data' => [
                'rol' => $rol->name,
                'permisos_asignados' => $rol->fresh()
                    ->permissions
                    ->pluck('name')
                    ->values()
            ]
        ], 200);
    }

    /**
     * 4. Obtener los permisos del usuario autenticado.
     * GET /api/usuario/permisos
     */
    public function misPermisos(Request $request)
    {
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'usuario_id' => $usuario->id,
                'roles' => $usuario->getRoleNames()->values(),
                'permisos' => $usuario->getAllPermissions()
                    ->pluck('name')
                    ->values()
            ]
        ], 200);
    }
}
