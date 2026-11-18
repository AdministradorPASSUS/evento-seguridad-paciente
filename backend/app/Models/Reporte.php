<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reporte extends Model
{
    use HasFactory;

    protected $table = 'reportes';

    protected $fillable = [
        'codigo',
        'numero_documento',
        'nombre_completo',
        'edad',
        'sede',
        'servicio',
        'entidad',
        'fecha_hora_evento',
        'relacionado_con',
        'descripcion_evento',
        'derivo_urgencias',
        'evidencia',
        'user_id',
        'estado'
    ];

    protected function casts(): array
    {
        return [
            'evidencia' => 'array',
            'derivo_urgencias' => 'boolean',
        ];
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function usuariosAsignados()
    {
        return $this->belongsToMany(
            User::class,
            'reporte_user',
            'reporte_id',
            'user_id'
        )->withTimestamps();
    }
    public function planAccion()
    {
        return $this->hasOne(PlanAccion::class, 'reporte_id');
    }
}
