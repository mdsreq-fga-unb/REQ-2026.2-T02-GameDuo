<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class CodigoRecuperacaoMail extends Mailable
{
    public function __construct(public string $codigo)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'GameDuo: código para redefinir sua senha');
    }

    public function content(): Content
    {
        $minutos = config('gameduo.recuperacao_minutos');

        return new Content(htmlString: "<p>Seu código para redefinir a senha do GameDuo é:</p>"
            ."<p style=\"font-size:28px;letter-spacing:6px\"><strong>{$this->codigo}</strong></p>"
            ."<p>Ele vale por {$minutos} minutos e só pode ser usado uma vez. "
            ."Se você não pediu a troca, ignore este e-mail.</p>");
    }
}
