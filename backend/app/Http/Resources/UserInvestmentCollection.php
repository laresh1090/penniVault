<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserInvestmentCollection extends ResourceCollection
{
    public $collects = UserInvestmentResource::class;

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
