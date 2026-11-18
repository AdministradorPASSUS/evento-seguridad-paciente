<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UsuariosRolesController extends Controller
{
    /**
     * Listar usuarios con sus roles.
     */
    public function index()
    {
        $usuarios = User::select([
            'id',
            'nombre',
            'segundo_nombre',
            'apellido',
            'segundo_apellido',
            'tipo_documento',
            'numero_documento',
            'nombre_usuario',
            'email',
            'activo',
            'created_at',
        ])
            ->with('roles:id,name,guard_name')
            ->orderBy('nombre')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $usuarios,
        ]);
    }

    /**
     * Registrar un usuario desde el módulo administrativo.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'segundo_nombre' => ['nullable', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'segundo_apellido' => ['required', 'string', 'max:255'],
            'tipo_documento' => ['required', 'string', 'max:10'],
            'numero_documento' => [
                'required',
                'string',
                'max:20',
                'unique:users,numero_documento',
            ],
            'nombre_usuario' => [
                'required',
                'string',
                'max:255',
                'unique:users,nombre_usuario',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => [
                'required',
                'string',
                'distinct',
                Rule::exists('roles', 'name')
                    ->where('guard_name', 'api'),
            ],
        ]);

        $usuario = User::create([
            'nombre' => $datos['nombre'],
            'segundo_nombre' => $datos['segundo_nombre'] ?? null,
            'apellido' => $datos['apellido'],
            'segundo_apellido' => $datos['segundo_apellido'],
            'tipo_documento' => $datos['tipo_documento'],
            'numero_documento' => $datos['numero_documento'],
            'nombre_usuario' => $datos['nombre_usuario'],
            'email' => $datos['email'],
            'password' => $datos['password'],
            'activo' => true,
        ]);

        $usuario->syncRoles($datos['roles']);

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado correctamente.',
            'data' => [
                'usuario' => $usuario,
                'roles' => $usuario->getRoleNames(),
            ],
        ], 201);
    }

    /**
     * Consultar el detalle de un usuario.
     */
    public function show($id)
    {
        $usuario = User::with('roles:id,name,guard_name')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'usuario' => $usuario->only([
                    'id',
                    'nombre',
                    'segundo_nombre',
                    'apellido',
                    'segundo_apellido',
                    'tipo_documento',
                    'numero_documento',
                    'nombre_usuario',
                    'email',
                    'activo',
                    'created_at',
                    'updated_at',
                ]),
                'roles' => $usuario->getRoleNames(),
            ],
        ]);
    }

    /**
     * Modificar los datos de un usuario y, opcionalmente, sus roles.
     */
    public function update(Request $request, $id)
    {
        $usuario = User::findOrFail($id);

        $datos = $request->validate([
            'nombre' => ['sometimes', 'required', 'string', 'max:255'],
            'segundo_nombre' => ['sometimes', 'nullable', 'string', 'max:255'],
            'apellido' => ['sometimes', 'required', 'string', 'max:255'],
            'segundo_apellido' => ['sometimes', 'required', 'string', 'max:255'],
            'tipo_documento' => ['sometimes', 'required', 'string', 'max:10'],
            'numero_documento' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('users', 'numero_documento')->ignore($usuario->id),
            ],
            'nombre_usuario' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'nombre_usuario')->ignore($usuario->id),
            ],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($usuario->id),
            ],
            'password' => ['sometimes', 'required', 'string', 'min:6', 'confirmed'],
            'roles' => ['sometimes', 'required', 'array', 'min:1'],
            'roles.*' => [
                'required',
                'string',
                'distinct',
                Rule::exists('roles', 'name')
                    ->where('guard_name', 'api'),
            ],
        ]);

        $roles = $datos['roles'] ?? null;
        unset($datos['roles']);

        $usuario->fill($datos);
        $usuario->save();

        if ($roles !== null) {
            $usuario->syncRoles($roles);
        }

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado correctamente.',
            'data' => [
                'usuario' => $usuario->fresh(),
                'roles' => $usuario->getRoleNames(),
            ],
        ]);
    }

    /**
     * Actualizar únicamente los roles de un usuario.
     */
    public function updateRoles(Request $request, $id)
    {
        $datos = $request->validate([
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => [
                'required',
                'string',
                'distinct',
                Rule::exists('roles', 'name')
                    ->where('guard_name', 'api'),
            ],
        ]);

        $usuario = User::findOrFail($id);
        $usuario->syncRoles($datos['roles']);

        return response()->json([
            'success' => true,
            'message' => 'Roles asignados correctamente.',
            'data' => [
                'usuario_id' => $usuario->id,
                'roles' => $usuario->getRoleNames(),
            ],
        ]);
    }

    /**
     * Cambiar el estado de un usuario.
     */
    public function cambiarEstado($id)
    {
        $usuario = User::findOrFail($id);

        if ($usuario->id === auth('api')->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes cambiar tu propio estado.',
            ], 422);
        }

        $usuario->activo = !$usuario->activo;
        $usuario->save();

        return response()->json([
            'success' => true,
            'message' => $usuario->activo
                ? 'Usuario activado correctamente.'
                : 'Usuario inactivado correctamente.',
            'data' => [
                'id' => $usuario->id,
                'activo' => (bool) $usuario->activo,
            ],
        ]);
    }
}



