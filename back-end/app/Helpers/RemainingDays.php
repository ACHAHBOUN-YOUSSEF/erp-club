<?php
if (!function_exists("RemainingDays")) {
    function RemainingDays($date_d, $date_f)
    {
        $date_now = new DateTime();

        if ($date_now->format("Y-m-d") >= $date_d) {
            $date_Fin = new DateTime($date_f);
            $interval = $date_now->diff($date_Fin);
            return $interval->invert ? 0 : $interval->days + 1;
        } else if ($date_now->format("Y-m-d") < $date_d) {
            $date_Fin = new DateTime($date_f);
            $date_now = new DateTime($date_d);
            $interval = $date_now->diff($date_Fin);
            return $interval->invert ? 0 : $interval->days;
        }
    }
}