<?php
namespace app\Model;

use Core\dbpdo;

class indexModel extends dbpdo{
    public  function __construct()
    {
        parent::__construct();
    }

    public function getmusic($id){
        $sql='select * from music';
        $con = $this->pdo->prepare($sql);
        // $con->bindValue(1,$id);
        $con ->execute();
        return $con->fetchAll();
    }


}