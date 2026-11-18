<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanAccion extends Model
{
    use HasFactory;

    protected $table = 'planes_accion';

    protected $fillable = [
        'reporte_id',
        'que',
        'quien',
        'cuando',
        'para_que',
        'donde',
        'estado_plan_accion',
        'creado_por',
        'fecha_ejecucion',
        'estado_actividad'
    ];

    public function reporte()
    {
        return $this->belongsTo(Reporte::class, 'reporte_id');
    }
}
