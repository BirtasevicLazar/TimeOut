<?php
$host = 'localhost';
$dbname = 'TimeOut';
$username = 'lazar';
$password = 'password';


$conn = new mysqli($host, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Greška pri konekciji: " . $conn->connect_error);
}

$conn->set_charset("utf8");

?>
