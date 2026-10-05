<?php

namespace App\Filament\Resources\Instructors\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class InstructorForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('specialty'),
                Textarea::make('biography')
                    ->columnSpanFull(),
                FileUpload::make('image')
                    ->image(),
                TextInput::make('phone')
                    ->tel(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email(),
                TextInput::make('instagram'),
                TextInput::make('linkedin'),
                TextInput::make('partnership_percent')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
