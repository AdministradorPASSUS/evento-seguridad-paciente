<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planes_accion', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reporte_id');

            // Campos requeridos solicitados
            $table->text('que');
            $table->string('quien');
            $table->date('cuando');
            $table->text('para_que');
            $table->string('donde');
            $table->string('estado_plan_accion');

            // Auditoría y usuario logeado
            $table->string('creado_por');

            // Campos opcionales (nullable)
            $table->date('fecha_ejecucion')->nullable();
            $table->string('estado_actividad')->nullable();

            $table->timestamps(); 

            // Llave foránea en cascada
            $table->foreign('reporte_id')
                  ->references('id')
                  ->on('reportes')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planes_accion');
    }
};
