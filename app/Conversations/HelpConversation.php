<?php

namespace App\Conversations;

use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Incoming\Answer;

class HelpConversation extends Conversation
{
    public function run()
    {
        $this->askOptions();
    }

    public function askOptions()
    {
        $question = Question::create("Please choose an option. What exactly are you looking for?")
            ->fallback('Unable to provide options at this time.')
            ->callbackId('choose_query')
            ->addButtons([
                Button::create('Register as an Applicant')->value('register'),
                Button::create('Payment Help')->value('payment'),
                Button::create('General Queries')->value('general_queries'), 
                Button::create('Substitution/Mutation Queries')->value('substitution_queries'),
                Button::create('NOC Queries')->value('noc_queries'),
                Button::create('Conversion Queries')->value('conversion_queries'),
                Button::create('Contact Us')->value('contact'),
                Button::create('Choose something else')->value('else'),
            ]);

        $this->ask($question, function (Answer $answer) {
            $value = $answer->getValue();

            $buttonTexts = [
                'register' => 'Register as an Applicant',
                'payment' => 'Payment Help',
                'general_queries' => 'General Queries',
                'substitution_queries' => 'Where can I submit any document/paper at L&DO office?',
                'noc_queries' => 'Where can I find directory of officials of L&DO?',
                'conversion_queries' => 'Can I submit offline application?',
                'contact' => 'What is the process for visiting L&DO office?',
                'else' => 'Choose something else'
            ];

            if (isset($buttonTexts[$value])) {
                // Echo the selected button as if user typed it
                $this->say("You selected: {$buttonTexts[$value]}");
            }

            switch ($value) {
                case 'register':
                    $this->say('You selected registration. <a href="https://ldo.mohua.gov.in/edharti/public-register" target="_blank">Click here to Register</a>');
                    $this->askRestartOptions('main');
                    break;
                case 'payment':
                    $this->say('You selected Payment Help. <a href="https://ldo.mohua.gov.in/administrator/storage/pdf/eServices_PaymentFlow.pdf" target="_blank">Click here for Help</a>');
                    $this->askRestartOptions('main');
                    break;
                case 'general_queries':
                    $this->askGeneralQueries();
                    break;
                case 'substitution_queries':
                    $this->askSubstitutionQueries(); 
                    break;
                case 'noc_queries':
                    $this->askNocQueries();
                    break;
                case 'conversion_queries':
                    $this->askConversionQueries();
                    break; 
                case 'contact':
                    $this->say('Please contact us with Nirman Bhawan Phone : 23022174, Email Address:ldo@nic.in.');
                    $this->askRestartOptions('main');
                    break;
                case 'else':
                    $this->say('Please contact us at <b>ldo@nic.in</b>');
                    $this->askRestartOptions('main');
                    break;                       
                default:
                    $this->say('Invalid selection.');
                    $this->run();
                    break;
            }
        });
    }

    public function askGeneralQueries()
    {
        $question = Question::create("Please select a general query you want help with:")
            ->fallback('Unable to provide general queries at this time.')
            ->callbackId('general_queries')
            ->addButtons([
                Button::create('What are the functions of Land and Development Office?')->value('q1'),
                Button::create('Where is the office located?')->value('q2'),
                Button::create('How many types of services provided by Land & Development Office?')->value('q3'),
                Button::create('Where can I submit any document/paper at L&DO office?')->value('q4'),
                Button::create('Where can I find directory of officials of L&DO?')->value('q5'),
                Button::create('Can I submit offline application?')->value('q6'),
                Button::create('What is the process for visiting L&DO office?')->value('q7'),
                Button::create('In case of any query/grievance, whom can I contact?')->value('q8'),
                Button::create('Back to Main Menu')->value('back_to_main'),
            ]);

        $this->ask($question, function (Answer $answer) {
            $value = $answer->getValue();

            $buttonTexts = [
                'q1' => 'What are the functions of Land and Development Office?',
                'q2' => 'Where is the office located?',
                'q3' => 'How many types of services provided by Land & Development Office?',
                'q4' => 'Where can I submit any document/paper at L&DO office?',
                'q5' => 'Where can I find directory of officials of L&DO?',
                'q6' => 'Can I submit offline application?',
                'q7' => 'What is the process for visiting L&DO office?',
                'q8' => 'In case of any query/grievance, whom can I contact?',
                'back_to_main' => 'Back to Main Menu',
            ];
            $this->echoSelectedButton($buttonTexts, $value);

            switch ($value) {
                case 'q1':
                    $this->say('Land & Development Office administers around 3% area of Delhi and maintains records of all Nazul lands acquired in 1911 for the formation of Capital at Delhi and land comprising Rehabilitation Colonies.');
                    $this->askRestartOptions('general');
                    break;
                case 'q2':
                    $this->say("Gate No. 4, 'A' Wing, 6th floor, Moulana Azad Road, Nirman Bhawan, New Delhi, 110011.");
                    $this->askRestartOptions('general');
                    break;
                case 'q3':
                    $this->say('<b>The following are the services provided by this office:</b><br>
                    • Conversion<br>
                    • Substitution<br>
                    • Mutation<br>
                    • Mortgage<br>
                    • Sale Permission<br>
                    • Gift Permission<br>
                    • Property Certificate<br>
                    • NOC for Freehold Properties');
                    $this->askRestartOptions('general');
                    break;
                    
                case 'q4':
                    $this->say("You can submit documents/papers at the Information Facilitation Centre (IFC) of the office. An acknowledgment receipt will be provided for tracking.");
                    $this->askRestartOptions('general');
                    break;
                case 'q5':
                    $this->say('Click here to open the directory: <a href="https://ldo.mohua.gov.in/whos-who" target="_blank">Open Directory</a>');
                    $this->askRestartOptions('general');
                    break;
                case 'q6':
                    $this->say('No, only online applications are accepted.');
                    $this->askRestartOptions('general');
                    break;
                case 'q7':
                    $this->say('One has to take an office visit appointment from our website. For virtual meeting, one can also book an e-hearing appointment.');
                    $this->say('<a href="https://ldo.mohua.gov.in/edharti/appointment" target="_blank">Click here to book an appointment</a>');
                    $this->askRestartOptions('general');
                    break;
                case 'q8':
                    $this->say('Click <a href="https://ldo.mohua.gov.in/contact" target="_blank">here</a> to check our support and contact details.');
                    $this->askRestartOptions('general');
                    break;
                case 'back_to_main':
                    $this->run();
                    break;
                default:
                    $this->say('Sorry, I did not understand your selection.');
                    $this->run();
                    break;
            }
        });
    }

    public function askSubstitutionQueries()
    {
        $question = Question::create("Select a substitution/mutation-related question:")
            ->fallback('Unable to provide substitution queries at this time.')
            ->callbackId('substitution_list')
            ->addButtons([
                Button::create('What is Substitution?')->value('sub_q1'),
                Button::create('What is Mutation?')->value('sub_q2'),
                Button::create('Who can apply for mutation?')->value('sub_q3'),
                Button::create('What are the documents required for substitution?')->value('sub_q4'),
                Button::create('What are the documents required for mutation?')->value('sub_q5'),
                Button::create('What is the application fee, and other charges?')->value('sub_q6'),
                Button::create('Is unearned increase recoverable in substitution?')->value('sub_q7'),
                Button::create('Is unearned increase recoverable in mutation?')->value('sub_q8'),
                Button::create('Is inspection mandatory for Substitution?')->value('sub_q9'),
                Button::create('Is inspection mandatory for Mutation?')->value('sub_q10'),
                Button::create('Back to Main Menu')->value('back_to_main'),
            ]);

        $this->ask($question, function (Answer $answer) {
            $value = $answer->getValue();

            // Map button values to their corresponding text
            $buttonTexts = [
                'sub_q1' => 'What is Substitution?',
                'sub_q2' => 'What is Mutation?',
                'sub_q3' => 'Who can apply for mutation?',
                'sub_q4' => 'What are the documents required for substitution?',
                'sub_q5' => 'What are the documents required for mutation?',
                'sub_q6' => 'What is the application fee, and other charges?',
                'sub_q7' => 'Is unearned increase recoverable in substitution?',
                'sub_q8' => 'Is unearned increase recoverable in mutation?',
                'sub_q9' => 'Is inspection mandatory for Substitution?',
                'sub_q10' => 'Is inspection mandatory for Mutation?',
                'back_to_main' => 'Back to Main Menu',
            ];
            $this->echoSelectedButton($buttonTexts, $value);

            switch ($value) {
                case 'sub_q1':
                    $this->say('Substitution is the process of mutation (transfer of legal rights) of the names of legal heirs on the death of the lessee.');
                    $this->askRestartOptions('substitution');
                    break;

                case 'sub_q2':
                    $this->say('Mutation is a process of substitution where, in place of the previous lessee, the names of new owners are entered after transfer like sale or gift.');
                    $this->askRestartOptions('substitution');
                    break;

                case 'sub_q3':
                    $this->say('Mutation can be carried out in the name of the transferee to whom the leased property has been transferred by sale, gift, or collusive decree (registered).');
                    $this->askRestartOptions('substitution');
                    break;

                case 'sub_q4':
                    $this->say('<b>Documents required for substitution:</b><br>
                • Self-attested copy of registered lease deed<br>
                • Surviving Member Certificate<br>
                • AADHAR and PAN card copies<br>
                • Newspaper advertisement (Hindi and English)<br>
                • Affidavit by the applicants on Rs. 100 non-judicial stamp paper attested by SDM/Sub-judge/1st Class magistrate<br>
                • Indemnity bond by the applicants on Rs. 100 non-judicial stamp paper attested by SDM/Sub-judge/1st Class magistrate<br>
                • Affidavit regarding loss of lease deed on Rs. 100 non-judicial stamp paper<br>
                • Newspaper advertisement regarding loss of lease deed<br>
                • No Objection Certificate (NOC) affidavit by all legal heirs, or Probate of the WILL from court<br>
                • Registered or unregistered WILL/Relinquishment Deed/NOC if required<br>
                • Any other required documents');
                    $this->askRestartOptions('substitution');
                    break;
                    

                case 'sub_q5':
                    $this->say('<b>Documents required for mutation:</b><br>
                    • Self-attested copy of registered lease deed<br>
                    • Self-attested copy of registered Conveyance Deed (in case of freehold)<br>
                    • Self-attested copy of registered Sale deed<br>
                    • Copy of Sanctioned Building Plan and/or existing plan<br>
                    • Surviving Member Certificate<br>
                    • Copy of AADHAR and PAN card<br>
                    • Copy of Newspaper Advertisement (Hindi and English)<br>
                    • Affidavit by applicants on Rs.100 non-judicial stamp paper<br>
                    • Indemnity bond on Rs.100 non-judicial stamp paper<br>
                    • Lost lease deed affidavit<br>
                    • Newspaper ad regarding lost lease deed<br>
                    • Relinquishment Deed/Gift Deed copy (if any)<br>
                    • Any other required documents');
                    $this->askRestartOptions('substitution');
                    break;
                

                case 'sub_q6':
                    $this->say('As of now, Rs. 1000 is charged for substitution/mutation application (after freehold). No charges for leasehold. No additional charges unless a pending demand exists.');
                    $this->askRestartOptions('substitution');
                    break;

                case 'sub_q7':
                    $this->say('Unearned increase shall not be levied in the case of transfer among family members at the time of succession.');
                    $this->askRestartOptions('substitution');
                    break;

                case 'sub_q8':
                    $this->say('As per lease deed terms (Appendix XI), unearned increase is recoverable in the case of second sale.');
                    $this->askRestartOptions('substitution');
                    break;

                case 'sub_q9':
                    $this->say('No. Inspection is not mandatory for substitution.');
                    $this->askRestartOptions('substitution');
                    break;

                case 'sub_q10':
                    $this->say('Yes. Inspection is mandatory for mutation.');
                    $this->askRestartOptions('substitution');
                    break;

                case 'back_to_main':
                    $this->run(); // go back to main help menu
                    break;

                default:
                    $this->say('Sorry, I did not understand your selection.');
                    $this->run();
                    break;
            }
        });
    }

    public function askNocQueries()
    {
        $question = Question::create("Select a NOC-related question:")
            ->fallback('Unable to provide NOC queries at this time.')
            ->callbackId('noc_queries')
            ->addButtons([
                Button::create('What is NOC?')->value('noc_q1'),
                Button::create('What are the types of document required for NOC?')->value('noc_q2'),
                Button::create('What is application fee of NOC?')->value('noc_q3'),
                Button::create('What is demand and without demand NOC?')->value('noc_q4'),
                Button::create('What is the crucial date for the properties not requiring NOC?')->value('noc_q5'),
                Button::create('Back to Main Menu')->value('back_to_main'),
            ]);

        $this->ask($question, function (Answer $answer) {
            $value = $answer->getValue();
            // Map button values to their corresponding text
            $buttonTexts = [
                'noc_q1' => 'What is NOC?',
                'noc_q2' => 'What are the types of document required for NOC?',
                'noc_q3' => 'What is application fee of NOC?',
                'noc_q4' => 'What is demand and without demand NOC?',
                'noc_q5' => 'What is the crucial date for the properties not requiring NOC?',
                'back_to_main' => 'Back to Main Menu',
            ];

            $this->echoSelectedButton($buttonTexts, $value);

            switch ($value) {
                case 'noc_q1':
                    $this->say('You selected: What is NOC?');
                    $this->say('No objection certificate is required for further transaction of the property with the Sub Registrar Office after freehold.');
                    $this->askRestartOptions('noc');
                    break;

                case 'noc_q2':
                    $this->say('You selected: What are the types of document required for NOC?');
                    $this->say('<b>Documents required for NOC:</b><br>
                    • Registered Lease deed, if any<br>
                    • Registered Conveyance deed<br>
                    • Registered Sale deed (if any)<br>
                    • Chain of title documents (Court Orders, Decree, Relinquishment deed, Will, etc.)<br>
                    • Substitution/Mutation done, if any (after freehold)<br>
                    • Photograph of the property<br>
                    • Latest electricity bill (not older than 6 months)<br>
                    • Undertaking regarding land use of property on Rs.10 non-judicial stamp paper');
                    $this->askRestartOptions('noc');
                    break;

                case 'noc_q3':
                    $this->say('As of now, Nil charges are levied for NOC.');
                    $this->askRestartOptions('noc');
                    break;

                case 'noc_q4':
                    $this->say('No objection certificate (NOC) is required for further property transaction after freehold.  
                    Properties converted into freehold on or before 14.02.2006 are called "without demand NOC" and those converted after 14.02.2006 are "with demand NOC" (for residential).  
                    For commercial properties, the cut-off is 01.04.2004.');
                    $this->askRestartOptions('noc');
                    break;

                case 'noc_q5':
                    $this->say('NOC is not required for registration of sale/purchase of properties converted from leasehold to freehold on or before 31.03.2000.');
                    $this->askRestartOptions('noc');
                    break;

                case 'back_to_main':
                    $this->run(); // go back to main menu
                    break;

                default:
                    $this->say('Sorry, invalid choice.');
                    $this->run();
                    break;
            }
        });
    }

    public function askConversionQueries()
    {
        $question = Question::create("Please select a Conversion related question:")
            ->fallback('Unable to provide conversion queries at this time.')
            ->callbackId('conversion_queries')
            ->addButtons([
                Button::create('Which properties are eligible for conversion?')->value('conv_q1'),
                Button::create('Is conversion compulsory or optional?')->value('conv_q2'),
                Button::create('Will conversion be allowed if there is encroachment?')->value('conv_q3'),
                Button::create('How long to grant conversion and issue conveyance deed?')->value('conv_q4'),
                Button::create('Back to Main Menu')->value('back_to_main'),
            ]);

        $this->ask($question, function (Answer $answer) {
            $value = $answer->getValue();

            // Map button values to their corresponding text
            $buttonTexts = [
                'conv_q1' => 'Which properties are eligible for conversion?',
                'conv_q2' => 'Is conversion compulsory or optional?',
                'conv_q3' => 'Will conversion be allowed if there is encroachment?',
                'conv_q4' => 'How long to grant conversion and issue conveyance deed?',
                'back_to_main' => 'Back to Main Menu',
            ];

            $this->echoSelectedButton($buttonTexts, $value);

            switch ($value) {
                case 'conv_q1':
                    $this->say('Eligible properties include all residential plots with allotment or perpetual lease by L&DO/Rehabilitation, industrial plots, built-up commercial/mixed land use properties with ownership rights.  
                    Properties not covered: Institutional allotments, disinvestment properties, petrol pumps, hotels, cinemas, etc.');
                    $this->askRestartOptions('conversion');
                    break;

                case 'conv_q2':
                    $this->say('Conversion from leasehold to freehold is optional, not compulsory.');
                    $this->askRestartOptions('conversion');
                    break;

                case 'conv_q3':
                    $this->say('No. Conversion will not be allowed if there is encroachment on the property.');
                    $this->askRestartOptions('conversion');
                    break;

                case 'conv_q4':
                    $this->say('It takes around three months from the date of submission of a complete application with all payments.');
                    $this->askRestartOptions('conversion');
                    break;

                case 'back_to_main':
                    $this->run(); // go back to main menu
                    break;

                default:
                    $this->say('Invalid selection.');
                    $this->run();
                    break;
            }
        });
    }


    public function askRestartOptions($fromWhere = 'main')
    {
        $question = Question::create("Would you like to ask another query or restart the chat?")
            ->fallback('Unable to restart.')
            ->callbackId('restart_options')
            ->addButtons([
                Button::create('Previous Menu')->value('previous'),
                Button::create('Main Menu')->value('main'),
                Button::create('End Chat')->value('end'),
            ]);

        $this->ask($question, function (Answer $answer) use ($fromWhere) {
            $choice = $answer->getValue();

            if ($choice === 'previous') {
                if ($fromWhere === 'general') {
                    $this->askGeneralQueries(); // Back to General Queries
                } elseif ($fromWhere === 'substitution') {
                    $this->askSubstitutionQueries(); // Back to Substitution Queries
                } elseif ($fromWhere === 'noc') {
                    $this->askNocQueries();
                } elseif ($fromWhere === 'conversion') {
                    $this->askConversionQueries();
                } else {
                    $this->askOptions(); // Back to Main Help Menu
                }
            } elseif ($choice === 'main') {
                $this->run(); // Back to Main Help Menu
            } elseif ($choice === 'end') {
                $this->say('Thank you for chatting with us. Have a great day!');
            } else {
                $this->say('Invalid choice. Restarting...');
                $this->run();
            }
        });
    }

    private function echoSelectedButton(array $buttonTexts, string $value): void
    {
        if (isset($buttonTexts[$value])) {
            $this->say("You selected: {$buttonTexts[$value]}");
        }
    }


}
