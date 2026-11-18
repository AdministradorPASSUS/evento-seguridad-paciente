<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reporte;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Exception;

class ReporteController extends Controller
{
    // Listar todos los reportes
    public function index()
    {
        try {
            // Cargamos el creador (si lo usas) y la relación many-to-many de usuarios asignados
            $reportes = Reporte::with(['usuario', 'usuariosAsignados'])
                ->withExists('planAccion')
                ->orderBy('created_at', 'desc')
                ->get();

            // Transformar la ruta de la evidencia para apuntar directamente a public/uploads/evidencias
            $reportes->each(function ($reporte) {
                if ($reporte->evidencia) {
                    $reporte->evidencia_url = url($reporte->evidencia);
                } else {
                    $reporte->evidencia_url = null;
                }
            });

            return response()->json([
                'success' => true,
                'data' => $reportes
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar los reportes.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Mostrar un reporte específico por ID
    public function show($id)
    {
        try {
            $reporte = Reporte::with([
                'usuario',
                'usuariosAsignados'
            ])->find($id);

            if (!$reporte) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reporte no encontrado.'
                ], 404);
            }

            $evidencias = $reporte->evidencia ?? [];

            // Si evidencia llega como texto JSON, convertirla en arreglo
            if (is_string($evidencias)) {
                $evidencias = json_decode($evidencias, true);

                // Si no era JSON válido, tratarlo como una ruta individual
                if (!is_array($evidencias)) {
                    $evidencias = [$reporte->evidencia];
                }
            }

            // Crear una URL por cada archivo
            $reporte->evidencia_urls = array_map(function ($ruta) {
                return url($ruta);
            }, $evidencias);

            return response()->json([
                'success' => true,
                'data' => $reporte
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el reporte.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Almacenar nuevo reporte con archivo adjunto y ruta directa (Apto para Hostinger)


    public function store(Request $request)
    {
        try {
            /**
             * Si existe una sesión autenticada, obtenemos el usuario.
             * Si el formulario es público, será null.
             */
            $user = Auth::guard('api')->user();

            // 1. Validación de los campos
            $request->validate([
                'numero_documento' => 'required|string|max:20',
                'nombre_completo' => 'required|string|max:255',
                'edad' => 'required|integer|min:0|max:120',
                'sede' => 'required|string',
                'servicio' => 'required|string',
                'entidad' => 'required|string',
                'fecha_hora_evento' => 'required|date',
                'relacionado_con' => 'required|string|max:255',
                'descripcion_evento' => 'required|string',
                'derivo_urgencias' => 'required',

                // Validación de múltiples archivos
                'evidencia' => 'nullable|array',
                'evidencia.*' => 'file|mimes:jpg,jpeg,png,pdf|max:8000',
            ]);

            // 2. Guardar las evidencias
            $rutasEvidencia = [];

            if ($request->hasFile('evidencia')) {
                $directorio = public_path('uploads/evidencias');

                if (!is_dir($directorio)) {
                    mkdir($directorio, 0755, true);
                }

                foreach ($request->file('evidencia') as $archivo) {
                    $nombreArchivo = uniqid() . '_' .
                        preg_replace(
                            '/[^A-Za-z0-9.\_-]/',
                            '_',
                            $archivo->getClientOriginalName()
                        );

                    $archivo->move($directorio, $nombreArchivo);

                    $rutasEvidencia[] =
                        'uploads/evidencias/' . $nombreArchivo;
                }
            }

            // 3. Generar código del reporte
            $codigoUnico = 'SP-' . date('Y') . '-' .
                str_pad(
                    Reporte::count() + 1,
                    4,
                    '0',
                    STR_PAD_LEFT
                );

            // 4. Crear el reporte
            $reporte = Reporte::create([
                'codigo' => $codigoUnico,
                'numero_documento' => $request->numero_documento,
                'nombre_completo' => $request->nombre_completo,
                'edad' => $request->edad,
                'sede' => $request->sede,
                'servicio' => $request->servicio,
                'entidad' => $request->entidad,
                'fecha_hora_evento' => $request->fecha_hora_evento,
                'relacionado_con' => $request->relacionado_con,
                'descripcion_evento' => $request->descripcion_evento,

                'derivo_urgencias' => filter_var(
                    $request->derivo_urgencias,
                    FILTER_VALIDATE_BOOLEAN
                ),

                // Guardar las rutas de las evidencias
                'evidencia' => !empty($rutasEvidencia)
                    ? json_encode($rutasEvidencia)
                    : null,

                // Usuario autenticado o NULL si es un reporte público
                'user_id' => $user?->id,

                'estado' => 'En revisión',
            ]);

            // 5. Preparar las URLs para la respuesta
            $reporte->evidencia_urls = array_map(
                fn($ruta) => url($ruta),
                $rutasEvidencia
            );

            return response()->json([
                'success' => true,
                'message' => 'Reporte registrado exitosamente',
                'data' => $reporte,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo completar el registro del reporte.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
