<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    
    protected $fillable = ["cin", "firstName", "lastName", "birthDate", "phone", "gender", "adresse", "email", "password", "imagePath", "brancheId"];
    
    protected $appends = ['image_url'];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birthDate' => 'date',
        ];
    }
    
    public function branche()
    {
        return $this->belongsTo(Branche::class, "brancheId");
    }
    
    public function getImageUrlAttribute()
    {
        if ($this->imagePath) {
            return asset('storage/' . $this->imagePath);
        }
        return asset('images/default-user.png');
    }
}