<?php

use App\Http\Controllers\AnalisisEventoController;
use App\Http\Controllers\AsignacionReporteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlanAccionController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\RolesPermisosController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UsuariosRolesController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/reportes', [ReporteController::class, 'store']);
// ->middleware('permission:reportes.crear');

// Rutas protegidas por JWT
Route::middleware('auth:api')->group(function () {

    // Autenticación
    Route::get('/user', [AuthController::class, 'userProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);


    // ==========================================
    // MÓDULO: REPORTE DE SEGURIDAD
    // ==========================================

    Route::middleware('permission:reportes.consultar')->group(function () {
        Route::get('/reportes', [ReporteController::class, 'index']);
        Route::get('/reportes/{id}', [ReporteController::class, 'show']);
    });



    Route::post('/reportes/{reporte}/asignar', [AsignacionReporteController::class, 'asignar'])
        ->middleware('permission:reportes.asignar');

    // Usuarios disponibles para el proceso de asignación
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:reportes.asignar');

    // ==========================================
    // MÓDULO: ANÁLISIS
    // ==========================================

    Route::get('/reportes/{reporteId}/analisis', [AnalisisEventoController::class, 'show'])
        ->middleware('permission:analisis.consultar');


    Route::get('/analisis', [AnalisisEventoController::class, 'index'])
        ->middleware('permission:analisis.consultar');

    Route::post('/reportes/{reporteId}/analisis', [AnalisisEventoController::class, 'storeOrUpdate']);


    // ==========================================
    // MÓDULO: PLAN DE MEJORA
    // ==========================================

    Route::get('/reportes/{reporteId}/plan-accion', [PlanAccionController::class, 'index'])
        ->middleware('permission:plan_mejora.consultar');

    Route::post('/reportes/{reporteId}/plan-accion', [PlanAccionController::class, 'storeOrUpdate']);

    Route::get('/plan-accion/{id}', [PlanAccionController::class, 'show'])
        ->middleware('permission:plan_mejora.consultar');

    // ==========================================
    // PERMISOS DEL USUARIO AUTENTICADO
    // ==========================================

    Route::get('/usuario/permisos', [RolesPermisosController::class, 'misPermisos']);

    // ==========================================
    // ADMINISTRACIÓN EXCLUSIVA DEL ADMINISTRADOR
    // ==========================================

    Route::middleware(['role:Administrador'])->group(function () {

        // Roles y permisos
        Route::get('/roles', [RolesPermisosController::class, 'index']);
        Route::get('/roles/{id}/permisos', [RolesPermisosController::class, 'show']);
        Route::put('/roles/{id}/permisos', [RolesPermisosController::class, 'update']);

        // Administración de usuarios
        Route::get('/administracion/usuarios', [UsuariosRolesController::class, 'index']);
        Route::post('/administracion/usuarios', [UsuariosRolesController::class, 'store']);
        Route::get('/administracion/usuarios/{id}', [UsuariosRolesController::class, 'show']);
        Route::put('/administracion/usuarios/{id}', [UsuariosRolesController::class, 'update']);
        Route::put('/administracion/usuarios/{id}/roles', [UsuariosRolesController::class, 'updateRoles']);
        Route::put('/administracion/usuarios/{id}/estado', [UsuariosRolesController::class, 'cambiarEstado']);
    });
});









































// <?php

// use App\Http\Controllers\AnalisisEventoController;
// use App\Http\Controllers\AsignacionReporteController;
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\PlanAccionController;
// use App\Http\Controllers\ReporteController;
// use App\Http\Controllers\RolesPermisosController;
// use App\Http\Controllers\UserController;
// use App\Http\Controllers\UsuariosRolesController;
// use Illuminate\Support\Facades\Route;

// // Rutas públicas
// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);

// // Rutas protegidas por JWT
// Route::middleware('auth:api')->group(function () {
//     Route::get('/user', [AuthController::class, 'userProfile']);
//     Route::post('/logout', [AuthController::class, 'logout']);

//     Route::get('/reportes', [ReporteController::class, 'index']);
//     Route::get('/reportes/{id}', [ReporteController::class, 'show']);
//     Route::post('/reportes', [ReporteController::class, 'store']);

//     Route::post('/reportes/{reporte}/asignar', [AsignacionReporteController::class, 'asignar']);

//     Route::get('/users', [UserController::class, 'index']);

//     Route::get('/reportes/{reporteId}/analisis', [AnalisisEventoController::class, 'show']);
//     Route::post('/reportes/{reporteId}/analisis', [AnalisisEventoController::class, 'storeOrUpdate']);

//     Route::get('/reportes/{reporteId}/plan-accion', [PlanAccionController::class, 'index']);
//     Route::post('/reportes/{reporteId}/plan-accion', [PlanAccionController::class, 'storeOrUpdate']);
//     Route::get('/plan-accion/{id}', [PlanAccionController::class, 'show']);


//     // Consultar permisos del usuario autenticado
//     Route::get('/usuario/permisos', [RolesPermisosController::class, 'misPermisos']);

//     // Administración exclusiva del Administrador
//     Route::middleware(['role:Administrador'])->group(function () {
//         Route::get('/roles', [RolesPermisosController::class, 'index']);
//         Route::get('/roles/{id}/permisos', [RolesPermisosController::class, 'show']);
//         Route::put('/roles/{id}/permisos', [RolesPermisosController::class, 'update']);


//         Route::get('/administracion/usuarios', [UsuariosRolesController::class, 'index']);
//         Route::get('/administracion/usuarios/{id}/roles', [UsuariosRolesController::class, 'show']);
//         Route::put('/administracion/usuarios/{id}/roles', [UsuariosRolesController::class, 'update']);

//         Route::put('/administracion/usuarios/{id}/estado', [UsuariosRolesController::class, 'cambiarEstado']);
//     });
// });
