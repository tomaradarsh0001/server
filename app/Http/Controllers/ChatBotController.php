<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Conversations\HelpConversation;
use BotMan\BotMan\BotMan;
use BotMan\BotMan\Messages\Incoming\Answer;

class ChatBotController extends Controller
{
    public function handle()
    {
        $botman = app('botman');

        $botman->hears('(?i)hi|hello|hey', function (BotMan $bot) {
            $bot->ask('Hello! May I know your First Name?', function (Answer $answer) {
                $name = $answer->getText();
                if (strtolower($name) === 'no') {
                    $this->say('Thanks, ending the chat.');
                } else {
                    $this->say('Thanks, ' . $name . '! Type <b>HELP</b> for more options.');
                }
            });
        });

        $botman->hears('(?i)help', function (BotMan $bot) {
            $bot->startConversation(new HelpConversation());
        });

        $botman->fallback(function (BotMan $bot) {
            $bot->reply('Invalid Input! Please type <b>Hi</b> to start again.');
        });

        $botman->listen();
    }

}
