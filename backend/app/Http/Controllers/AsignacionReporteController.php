<?php


namespace App\Http\Controllers;

use App\Models\Reporte;
use App\Mail\NotificacionAsignacionReporte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Exception;

class AsignacionReporteController extends Controller
{
    public function asignar(Request $request, $reporteId)
    {
        try {
            $request->validate([
                'usuarios_ids' => 'required|array',
                'usuarios_ids.*' => 'exists:users,id',
            ]);

            $reporte = Reporte::findOrFail($reporteId);

            DB::transaction(function () use ($reporte, $request) {
                // Sincronizar usuarios asignados
                $reporte->usuariosAsignados()->sync($request->usuarios_ids);

                if ($reporte->estado === 'Pendiente' && count($request->usuarios_ids) > 0) {
                    $reporte->update(['estado' => 'En revisión']);
                }
            });

            // Cargar la relación actualizada con los correos y nombres
            $reporte->load('usuariosAsignados');

            // Enviar correo a cada usuario recién asignado
            foreach ($reporte->usuariosAsignados as $usuario) {
                if (!empty($usuario->email)) {
                    Mail::to($usuario->email)->send(new NotificacionAsignacionReporte($reporte));
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Responsables asignados y notificados por correo correctamente.',
                'data' => $reporte
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al realizar la asignación y notificación.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
