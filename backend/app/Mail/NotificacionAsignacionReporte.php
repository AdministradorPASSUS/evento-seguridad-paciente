<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Reporte;

class NotificacionAsignacionReporte extends Mailable
{
    use Queueable, SerializesModels;

    public $reporte; 

    public function __construct(Reporte $reporte)
    {
        $this->reporte = $reporte;
    }

    public function build()
    {
        return $this->subject('Nuevo Reporte Asignado - Seguridad del Paciente (Passus)')
                    ->view('emails.asignacion-reporte');
    }
}

