<?php

// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Puedes filtrar por roles si usas Spatie o simplemente traer todos los usuarios activos
            $users = User::select('id', 'nombre', 'segundo_nombre', 'apellido', 'segundo_apellido','email')->get();

            return response()->json([
                'success' => true,
                'data' => $users
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la lista de usuarios.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
