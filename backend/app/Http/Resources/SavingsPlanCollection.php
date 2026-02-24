<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class SavingsPlanCollection extends ResourceCollection
{
    public $collects = SavingsPlanResource::class;

    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->total(),
                'page' => $this->currentPage(),
                'perPage' => $this->perPage(),
                'totalPages' => $this->lastPage(),
            ],
        ];
    }
}
