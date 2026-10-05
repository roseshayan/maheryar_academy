<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $roles = [
            'Super Admin',
            'Manager',
            'Content Creator',
            'SEO Manager',
            'Employee',
            'Customer',
            'Accountant'
        ];

        foreach ($roles as $role) {
            \Spatie\Permission\Models\Role::create(['name' => $role]);
        }

        // Assign Super Admin role to the first user
        $user = \App\Models\User::first();
        if ($user) {
            $user->assignRole('Super Admin');
        }
    }
}
