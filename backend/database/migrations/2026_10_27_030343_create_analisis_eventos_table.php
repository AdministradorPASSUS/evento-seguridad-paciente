<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('analisis_eventos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reporte_id')->unique();

            // Datos generales de la primera pantalla
            $table->text('trayectoria_paciente');
            $table->json('participantes_analisis');
            $table->text('observaciones_involucrados');
            $table->json('recopilacion_documentos');
            $table->text('observaciones_recopilacion');
            $table->text('aspectos_positivos');
            $table->text('medidas_implementadas');
            $table->text('fallas_activas');

            // Factores contribuyentes (Switches + Selects + Observaciones)
            $table->boolean('factor_paciente_activo')->default(false);
            $table->json('factor_paciente_items')->nullable();
            $table->text('factor_paciente_obs')->nullable();

            $table->boolean('factor_individuo_activo')->default(false);
            $table->json('factor_individuo_items')->nullable();
            $table->text('factor_individuo_obs')->nullable();

            $table->boolean('factor_tarea_activo')->default(false);
            $table->json('factor_tarea_items')->nullable();
            $table->text('factor_tarea_obs')->nullable();

            $table->boolean('factor_informacion_activo')->default(false);
            $table->json('factor_informacion_items')->nullable();
            $table->text('factor_informacion_obs')->nullable();

            $table->boolean('factor_equipo_activo')->default(false);
            $table->json('factor_equipo_items')->nullable();
            $table->text('factor_equipo_obs')->nullable();

            $table->boolean('factor_ambiente_activo')->default(false);
            $table->json('factor_ambiente_items')->nullable();
            $table->text('factor_ambiente_obs')->nullable();

            $table->boolean('factor_organizacional_activo')->default(false);
            $table->json('factor_organizacional_items')->nullable();
            $table->text('factor_organizacional_obs')->nullable();

            // Clasificación y Cierre
            $table->string('clasificacion_evento')->nullable();
            $table->string('severidad')->nullable();
            $table->string('prevenible')->nullable();
            $table->string('aplica_plan_accion')->nullable();
            $table->text('link_video')->nullable();
            $table->string('documento_adjunto')->nullable();

            $table->timestamps();

            $table->foreign('reporte_id')->references('id')->on('reportes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analisis_eventos');
    }
};
