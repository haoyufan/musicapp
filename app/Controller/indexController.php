<?php
namespace app\Controller;

require MODEL.'indexModel.php';
require MODEL . 'adminModel.php';
use app\Model\adminModel;
use app\Model\indexModel;
use Core\Fromwork;

class indexController extends Fromwork{
    public function index()
    {
        $method = 'album';
        $size = 2;
        $music = new adminModel();
        $data = $music->getALLcat($size,1,'album');
        $this->assgin('num', ceil($music->getalbumpage('album') / $size));
        $this->assgin('album',$data);
        $this->assgin('method','ablum');
        $this->display('default/index.html');
    }

    public function page(){
        $data = $_GET['page'];
        $music = new adminModel();
        $list = $music->getALLcat(2,$data,'album');
        $this->json($list);
    }

    public function get_music(){
        $data = $_GET['albumId'];
        $list = new adminModel();
        $this->json($list->getmusic($data));
    }

    public function cal(){
        $this->display('default/cal.html');
    }
}