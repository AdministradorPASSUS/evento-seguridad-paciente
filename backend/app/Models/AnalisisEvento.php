<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalisisEvento extends Model
{
    use HasFactory;

    protected $table = 'analisis_eventos';

    protected $fillable = [
        'reporte_id',
        'trayectoria_paciente',
        'participantes_analisis',
        'observaciones_involucrados',
        'recopilacion_documentos',
        'observaciones_recopilacion',
        'aspectos_positivos',
        'medidas_implementadas',
        'fallas_activas',

        'factor_paciente_activo',
        'factor_paciente_items',
        'factor_paciente_obs',

        'factor_individuo_activo',
        'factor_individuo_items',
        'factor_individuo_obs',

        'factor_tarea_activo',
        'factor_tarea_items',
        'factor_tarea_obs',

        'factor_informacion_activo',
        'factor_informacion_items',
        'factor_informacion_obs',

        'factor_equipo_activo',
        'factor_equipo_items',
        'factor_equipo_obs',

        'factor_ambiente_activo',
        'factor_ambiente_items',
        'factor_ambiente_obs',

        'factor_organizacional_activo',
        'factor_organizacional_items',
        'factor_organizacional_obs',

        'clasificacion_evento',
        'severidad',
        'prevenible',
        'aplica_plan_accion',
        'link_video',
        'documentos_adjuntos',
    ];

    protected $casts = [
        'participantes_analisis' => 'array',
        'recopilacion_documentos' => 'array',
        'factor_paciente_items' => 'array',
        'factor_individuo_items' => 'array',
        'factor_tarea_items' => 'array',
        'factor_informacion_items' => 'array',
        'factor_equipo_items' => 'array',
        'factor_ambiente_items' => 'array',
        'factor_organizacional_items' => 'array',
        'documentos_adjuntos' => 'array',


    ];

    public function reporte()
    {
        return $this->belongsTo(Reporte::class);
    }
}
