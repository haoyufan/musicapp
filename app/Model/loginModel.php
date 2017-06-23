<?php
namespace app\Model;

use Core\dbpdo;

class loginModel extends dbpdo {
    public function __construct()
    {
        parent::__construct();
    }

    public  function check($user,$pass){
        $r=$this->fetchAll('select *  from admin');
        if($user ===$r[0]['account'] && $pass === $r[0]['password']){
            return true;
        }else{
            return false;
        }
     }

    public function hash($hash){
         $r=$this->fetchAll('select hash  from admin');
        if($hash ===$r[0]['hash']){
            return true;
        }else{
            return false;
        }
     }
}