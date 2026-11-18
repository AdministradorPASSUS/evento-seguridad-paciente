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
        Schema::create('reportes', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique(); // Ej: SP-2026-0001
            $table->string('numero_documento');
            $table->string('nombre_completo');
            $table->integer('edad');
            $table->string('sede');
            $table->string('servicio');
            $table->string('entidad'); // EPS o ARP
            $table->dateTime('fecha_hora_evento');
            $table->text('descripcion_evento');
            $table->boolean('derivo_urgencias')->default(false);
            $table->string('evidencia')->nullable(); // Ruta del archivo subido
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Quien reporta en el sistema
            $table->string('estado')->default('En revisión');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes');
    }
};
