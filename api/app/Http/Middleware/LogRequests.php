<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class LogRequests
{
    public function handle($request, Closure $next)
    {
        $requestData = [
            'Method' => $request->method(),
            'URL' => $request->fullUrl(),
            'IP' => $request->ip(),
            'User Agent' => $request->userAgent(),
            'Request Parameters' => $request->all(),
        ];

        Log::info('Incoming Request', $requestData);

        return $next($request);
    }
}
