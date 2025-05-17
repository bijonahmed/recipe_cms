<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;

class Guestsendingmail extends Mailable
{
    use Queueable, SerializesModels;

    public $customData;

   
    public function __construct($customData)
    {
        $this->customData = $customData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Moon Nest Account',
        );
    }


    public function build()
    {
        return $this->subject('Moon Nest Account')
                    ->view('emails.guestaccount')
                    ->with('acdata', $this->customData);
    }
   
    public function attachments(): array
    {
        return [];
    }
}
