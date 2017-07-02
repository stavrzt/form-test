<?php

$inputValue = $_POST['value'];

switch ($_POST['id']) {
    case 'sum':
        numberBetween(1, 10000, intval($inputValue));
        break;
    case 'term':
        numberBetween(1, 12, intval($inputValue));
        break;
    case 'ic':
        identCode($inputValue);
        break;
    case 'surname':
        isNotEmpty($inputValue);
        break;
    case 'name':
        isNotEmpty($inputValue);
        break;
    case 'city':
        isNotEmpty($inputValue);
        break;
}

function numberBetween($min, $max, $inputValue)
{
    if (is_int($inputValue) && $min <= $inputValue && $inputValue <= $max) {
        echo true;
    }
    else{
        echo json_encode(['valid' => 'false', 'errorMsgId' => $_POST['id']]);
    }
}
function identCode($inputValue)
{
    if (preg_match("/^\d*\.?\d*$/", $inputValue) && strlen($inputValue) == 10) {
        $countOfDays = substr($inputValue, 0, 5);

        $startDate = date_create('1900-01-00');
        $dateOfBirth = date_add($startDate, date_interval_create_from_date_string($countOfDays . 'days'));

        $years = date_diff($dateOfBirth, date_create('today'))->y;

        if ($years == 21) {
            echo true;
        } else {
            echo json_encode(['valid' => 'false', 'errorMsgId' => 'ic2']);
        }
    } else {
        echo json_encode(['valid' => 'false', 'errorMsgId' => 'ic1']);
    }
}
function isNotEmpty($inputValue)
{
    $inputValue = str_replace(' ', '', $inputValue);
    if (empty($inputValue)) {
        echo json_encode(['valid' => 'false', 'errorMsgId' => $_POST['id']]);
    } else {
        echo true;
    }
}
