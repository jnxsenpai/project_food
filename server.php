<?php
$_POST = json_decode(file_get_contents("php://input"), true);
echo var_dump($_POST); // php файл работающий на бэкенде
                        // команда echo берет те данные, 
                        //которые пришли нам с клиента, 
                        //превращает их в строку и показывает обратно на клиенте