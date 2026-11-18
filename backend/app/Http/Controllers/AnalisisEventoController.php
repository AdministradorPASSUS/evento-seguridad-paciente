<?php

namespace App\Http\Controllers;

use App\Models\AnalisisEvento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Reporte;

class AnalisisEventoController extends Controller
{
    public function show($reporteId)
    {
        try {
            $analisis = AnalisisEvento::where('reporte_id', $reporteId)->first();

            if (!$analisis) {
                return response()->json([
                    'message' => 'No existe un análisis para este reporte.'
                ], 404);
            }

            $documentos = $analisis->documentos_adjuntos ?? [];

            if (is_string($documentos)) {
                $documentos = json_decode($documentos, true) ?? [];
            }

            $analisis->documentos_adjuntos_urls = collect(
                $analisis->documentos_adjuntos ?? []
            )->map(function ($ruta) {
                return [
                    'nombre' => basename($ruta),
                    'ruta' => $ruta,
                    'url' => asset($ruta),
                ];
            });

            return response()->json([
                'data' => $analisis
            ]);
        } catch (\Exception $e) {

            Log::error('Error al consultar análisis: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al consultar el análisis.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function index()
    {
        try {

            $reportes = Reporte::query()
                ->select('reportes.*')
                ->selectRaw("
                EXISTS (
                    SELECT 1
                    FROM analisis_eventos
                    WHERE analisis_eventos.reporte_id = reportes.id
                ) AS tiene_analisis
            ")
                ->orderByDesc('reportes.created_at')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Listado de reportes para análisis consultado correctamente.',
                'data' => $reportes
            ], 200);
        } catch (\Exception $e) {

            Log::error('Error al consultar listado de análisis: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'No se pudo consultar el listado de análisis.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeOrUpdate(Request $request, $reporteId)
    {
        try {

            // 1. Obtener análisis existente para determinar la operación
            $analisis = AnalisisEvento::where('reporte_id', $reporteId)->first();

            // 2. Verificar permiso de creación o edición
            $permisoRequerido = $analisis
                ? 'analisis.editar'
                : 'analisis.crear';

            if (!$request->user()->can($permisoRequerido)) {
                return response()->json([
                    'success' => false,
                    'message' => $analisis
                        ? 'No tienes permisos para editar el análisis del evento.'
                        : 'No tienes permisos para crear el análisis del evento.'
                ], 403);
            }

            // 3. Convertir los campos JSON recibidos desde FormData en arreglos PHP
            $arrayFields = [
                'participantes_analisis',
                'factor_paciente_items',
                'factor_individuo_items',
                'factor_tarea_items',
                'factor_informacion_items',
                'factor_equipo_items',
                'factor_ambiente_items',
                'factor_organizacional_items',
            ];

            foreach ($arrayFields as $field) {
                if ($request->has($field) && is_string($request->input($field))) {

                    $decoded = json_decode($request->input($field), true);

                    if (json_last_error() === JSON_ERROR_NONE) {
                        $request->merge([
                            $field => $decoded
                        ]);
                    }
                }
            }

            // 4. Reglas de validación base obligatorias
            $rules = [
                'fallas_activas' => 'required|string',
                'participantes_analisis' => 'required|array|min:1',
                'participantes_analisis.*' => 'in:pacientes,familiares,colaborador,no',
            ];

            // 5. Validación condicional para FACTOR PACIENTE
            if ($request->boolean('factor_paciente_activo')) {
                $rules['factor_paciente_items'] = 'required|array|min:1';
                $rules['factor_paciente_items.*'] = 'in:Patología y comorbilidades,Lenguaje y comunicación,Personalidad,Factores psicológicos,Factores sociales,No identificado';
                $rules['factor_paciente_obs'] = 'required|string';
            }

            // 6. Validación condicional para FACTOR INDIVIDUO
            if ($request->boolean('factor_individuo_activo')) {
                $rules['factor_individuo_items'] = 'required|array|min:1';
                $rules['factor_individuo_items.*'] = 'in:Conocimientos y habilidades,Competencia,Experiencia profesional,Salud física o mental,Valores y comportamiento profesional,Retraso o demoras para realizar las actividades asignadas';
                $rules['factor_individuo_obs'] = 'required|string';
            }

            // 7. Validación condicional para FACTOR TAREA
            if ($request->boolean('factor_tarea_activo')) {
                $rules['factor_tarea_items'] = 'required|array|min:1';
                $rules['factor_tarea_items.*'] = 'in:Diseño de las tareas y claridad en su estructura,Disponibilidad, divulgación y uso de sus protocolos,Disponibilidad y precision,No identificado';
                $rules['factor_tarea_obs'] = 'required|string';
            }

            // 8. Validación condicional para FACTOR INFORMACIÓN
            if ($request->boolean('factor_informacion_activo')) {
                $rules['factor_informacion_items'] = 'required';
                $rules['factor_informacion_obs'] = 'required|string';
            }

            // 9. Validación condicional para FACTOR EQUIPO
            if ($request->boolean('factor_equipo_activo')) {
                $rules['factor_equipo_items'] = 'required';
                $rules['factor_equipo_obs'] = 'required|string';
            }

            // 10. Validación condicional para FACTOR AMBIENTE
            if ($request->boolean('factor_ambiente_activo')) {
                $rules['factor_ambiente_items'] = 'required';
                $rules['factor_ambiente_obs'] = 'required|string';
            }

            // 11. Validación condicional para FACTOR ORGANIZACIONAL
            if ($request->boolean('factor_organizacional_activo')) {
                $rules['factor_organizacional_items'] = 'required';
                $rules['factor_organizacional_obs'] = 'required|string';
            }

            // 12. Ejecutar validación
            $request->validate($rules);

            // 13. Preparar información para guardar
            $data = $request->all();
            $data['reporte_id'] = $reporteId;

            // Obtener documentos actualmente guardados
            $documentosExistentes = $analisis?->documentos_adjuntos ?? [];

            if (is_string($documentosExistentes)) {
                $documentosExistentes = json_decode($documentosExistentes, true) ?? [];
            }

            if (!is_array($documentosExistentes)) {
                $documentosExistentes = [];
            }

            // Recibir documentos que React indica que deben conservarse
            $documentosConservados = json_decode(
                $request->input('documentos_adjuntos_conservados', '[]'),
                true
            );

            if (!is_array($documentosConservados)) {
                $documentosConservados = [];
            }

            // Solo permitir conservar archivos que ya pertenecían al análisis
            $documentosConservados = array_values(
                array_intersect(
                    $documentosExistentes,
                    $documentosConservados
                )
            );

            // Identificar documentos eliminados
            $documentosEliminados = array_diff(
                $documentosExistentes,
                $documentosConservados
            );

            // Guardar documentos nuevos
            $documentosNuevos = [];

            if ($request->hasFile('documentos_adjuntos')) {

                $directorio = public_path('uploads/analisis');

                if (!File::exists($directorio)) {
                    File::makeDirectory($directorio, 0755, true);
                }

                foreach ($request->file('documentos_adjuntos') as $file) {

                    $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();

                    $file->move($directorio, $filename);

                    $documentosNuevos[] = 'uploads/analisis/' . $filename;
                }
            }

            // Construir lista definitiva de documentos
            $data['documentos_adjuntos'] = array_values(
                array_merge(
                    $documentosConservados,
                    $documentosNuevos
                )
            );

            // Quitar campos auxiliares para evitar guardarlos en la tabla
            unset($data['documentos_adjuntos_conservados']);

            // 14. Crear o actualizar análisis
            $analisis = AnalisisEvento::updateOrCreate(
                ['reporte_id' => $reporteId],
                $data
            );

            // 15. Eliminar físicamente los documentos que fueron quitados
            foreach ($documentosEliminados as $ruta) {

                // Seguridad: permitir eliminar únicamente archivos de esta carpeta
                if (!str_starts_with($ruta, 'uploads/analisis/')) {
                    continue;
                }

                $archivo = public_path($ruta);

                if (File::exists($archivo)) {
                    File::delete($archivo);
                }
            }

            // 16. Actualizar estado del reporte
            $reporte = \App\Models\Reporte::find($reporteId);

            if ($reporte) {
                $reporte->estado = 'Analizado';
                $reporte->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Análisis guardado con éxito',
                'data' => $analisis
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {

            return response()->json([
                'message' => 'Hay errores de validación en los campos requeridos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {

            Log::error("Error al guardar el análisis del reporte {$reporteId}: " . $e->getMessage());

            return response()->json([
                'message' => 'Ocurrió un error al guardar el análisis.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
