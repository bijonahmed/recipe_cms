<?php

namespace App\Http\Controllers\Public;

use Cart;
use Carbon\Carbon;

use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Redirect;


class LanguageController extends Controller
{


    public function index()
    {
        $languages = Language::where('status', 1)->get();
        $createdTranslations = [];

        foreach ($languages as $language) {
            $translations = Translation::where('language_code', $language->code)->get();
            if ($translations->isEmpty()) {
                $englishTranslations = Translation::where('language_code', 'en')->get();
                foreach ($englishTranslations as $englishTranslation) {
                    try {
                        $translation = Translation::create([
                            'language_code' => $language->code,
                            'translation_key' => $englishTranslation->translation_key,
                            'translated_value' => "",
                        ]);
                        $createdTranslations[] = $translation; // Store the created translations
                    } catch (\Exception $e) {
                        \Log::error('Translation creation failed: ' . $e->getMessage());
                        return response()->json(['error' => 'Translation creation failed: ' . $e->getMessage()], 500);
                    }
                }
            }
        }
    
        return response()->json(['languages' => $languages, 'created_translations' => $createdTranslations]);
    }
    public function getTexts(Request $request)
    {
        //dd($request->all());
        $request->validate([
            'lang' => 'required|string|exists:languages,code',
        ]);

        $language = $request->input('lang');
        // Load translations using the model method
        $translations = Translation::getTranslationsByLanguage($language);


        return response()->json([
            'translations' => $translations,
            'availableLanguages' => Language::pluck('code'),
        ]);
    }
}
