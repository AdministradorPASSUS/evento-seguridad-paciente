<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesPermisosSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $guard = 'api';

        // Acciones disponibles para los módulos funcionales
        $acciones = [
            'crear',
            'consultar',
            'editar',
            'validar',
            'aprobar',
            'asignar',
            'cerrar',
            'exportar',
        ];

        // Administración conserva todas las acciones
        $accionesAdministracion = [
            ...$acciones,
            'administrar',
        ];

        // Módulos disponibles
        $modulos = [
            'administracion',
            'analisis',
            'indicadores',
            'plan_mejora',
            'reportes',
        ];

        // Crear permisos de cada módulo
        foreach ($modulos as $modulo) {

            $accionesModulo = $modulo === 'administracion'
                ? $accionesAdministracion
                : $acciones;

            foreach ($accionesModulo as $accion) {
                Permission::firstOrCreate([
                    'name' => "{$modulo}.{$accion}",
                    'guard_name' => $guard,
                ]);
            }
        }

        // Eliminar los permisos administrar de los demás módulos
        Permission::where('guard_name', $guard)
            ->whereIn('name', [
                'analisis.administrar',
                'indicadores.administrar',
                'plan_mejora.administrar',
                'reportes.administrar',
            ])
            ->delete();

        // Matriz de permisos por rol y módulo
        $matriz = [

            'Administrador' => [
                'administracion' => $accionesAdministracion,
                'analisis' => $acciones,
                'indicadores' => $acciones,
                'plan_mejora' => $acciones,
                'reportes' => $acciones,
            ],

            'Calidad' => [
                'analisis' => $acciones,
                'indicadores' => ['consultar'],
                'plan_mejora' => $acciones,
                'reportes' => $acciones,
            ],

            'Cargos asistenciales' => [
                'reportes' => ['crear', 'consultar'],
            ],

            'Profesional de enlace' => [
                'analisis' => [
                    'crear',
                    'consultar',
                    'editar',
                    'aprobar',
                    'exportar',
                ],
                'indicadores' => ['consultar'],
                'reportes' => ['crear', 'exportar'],
            ],

            'Referente de seguridad del paciente' => [
                'analisis' => $acciones,
                'indicadores' => ['consultar'],
                'plan_mejora' => $acciones,
                'reportes' => $acciones,
            ],

            'Subgerente de prestación de servicios' => [
                'reportes' => [
                    'crear',
                    'consultar',
                    'editar',
                    'exportar',
                ],
                'indicadores' => ['consultar'],
                'plan_mejora' => $acciones,
                'analisis' => [
                    'crear',
                    'consultar',
                    'exportar',
                ],
            ],

            'Supervisores de sede' => [
                'analisis' => ['crear', 'consultar'],
                'indicadores' => ['consultar'],
                'plan_mejora' => ['crear', 'consultar'],
                'reportes' => ['crear', 'consultar'],
            ],

            'Todos los colaboradores' => [
                'reportes' => ['crear'],
            ],
        ];

        // Crear roles y sincronizar sus permisos
        foreach ($matriz as $nombreRol => $modulosRol) {

            $rol = Role::firstOrCreate([
                'name' => $nombreRol,
                'guard_name' => $guard,
            ]);

            $permisosRol = [];

            foreach ($modulosRol as $modulo => $accionesPermitidas) {
                foreach ($accionesPermitidas as $accion) {
                    $permisosRol[] = "{$modulo}.{$accion}";
                }
            }

            $rol->syncPermissions($permisosRol);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
