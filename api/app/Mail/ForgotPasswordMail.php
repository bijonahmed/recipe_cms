<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ForgotPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $details;


    public function __construct($details)
    {
        $this->details = $details;
    }


    public function build()
    {

    //dd($this->details);
    return $this->subject('Forget Password OCN')
                ->view('emails.forgetPassword')->with([
                    'token' => $this->details['token'],
                    'baseUrl' => $this->details['baseUrl'],
                ]);;
    }
}
