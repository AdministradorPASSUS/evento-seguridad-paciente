<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PlanAccion;
use App\Models\AnalisisEvento; // <--- Importante importar el modelo
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PlanAccionController extends Controller
{
    public function index($reporteId)
    {
        try {
            $acciones = PlanAccion::where('reporte_id', $reporteId)->get();
            return response()->json($acciones, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al cargar los planes de acción.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $accion = PlanAccion::find($id);

            if (!$accion) {
                return response()->json(['message' => 'Plan de acción no encontrado.'], 404);
            }

            return response()->json($accion, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al consultar el plan de acción.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function storeOrUpdate(Request $request, $reporteId)
    {
        // 1. Validar si existe el análisis previo para este reporte
        $analisisExiste = AnalisisEvento::where('reporte_id', $reporteId)->exists();

        if (!$analisisExiste) {
            return response()->json([
                'message' => 'No se puede registrar un plan de acción sin haber completado y guardado previamente el análisis del evento.'
            ], 422);
        }

        // 2. Verificar si ya existen planes de acción para el reporte
        $planExiste = PlanAccion::where('reporte_id', $reporteId)->exists();

        // 3. Validar el permiso según la operación
        $permisoRequerido = $planExiste
            ? 'plan_mejora.editar'
            : 'plan_mejora.crear';

        if (!$request->user()->can($permisoRequerido)) {
            return response()->json([
                'success' => false,
                'message' => $planExiste
                    ? 'No tienes permisos para editar el plan de acción.'
                    : 'No tienes permisos para crear un plan de acción.'
            ], 403);
        }

        // 4. Validación de los campos del formulario
        $request->validate([
            'acciones' => 'required|array|min:1',
            'acciones.*.que' => 'required|string',
            'acciones.*.quien' => 'required|string',
            'acciones.*.cuando' => 'required|date',
            'acciones.*.para_que' => 'required|string',
            'acciones.*.donde' => 'required|string',
            'acciones.*.estado_plan_accion' => 'required|string',
            'acciones.*.fecha_ejecucion' => 'nullable|date',
            'acciones.*.estado_actividad' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // 5. Reemplazar las acciones anteriores
            PlanAccion::where('reporte_id', $reporteId)->delete();

            $usuarioLogeado = Auth::user()
                ? (Auth::user()->name ?? Auth::user()->email ?? 'Usuario')
                : 'Sistema';

            $guardadas = [];

            foreach ($request->acciones as $accionData) {
                $accionData['reporte_id'] = $reporteId;
                $accionData['creado_por'] = $usuarioLogeado;

                $guardadas[] = PlanAccion::create($accionData);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Planes de acción guardados con éxito',
                'data' => $guardadas
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al guardar los planes de acción.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
