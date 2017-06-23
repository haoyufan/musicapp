<?php

namespace app\Controller;
require MODEL . 'adminModel.php';

use app\Model\adminModel;
use Core\Fromwork;

class adminController extends Fromwork
{
    public function __construct()
    {
        session_start();
        if (!isset($_SESSION['login'])) {
            $this->header('/login');
        }
    }

//专辑区
    public function index()
    {
        $method = 'ablum';
        $music = new adminModel();
        $page = isset($_GET['page']) ? $_GET['page'] : 1;
        $_SESSION['page'] = $page;
        $size = 2;
        $num = ceil($music->getalbumpage('album') / $size);

        //prev
        $html = $this->findPage($page, $num, '/index.php/admin');
        //所有专辑
        $album = $music->getALLcat($size, $page, 'album');
        $this->assgin('album', $album);

        include VIEW . 'admin/index.html';
    }

    //add
    public function add_album()
    {
        $method = 'add_ablum';
        include VIEW . 'admin/add_album.html';
    }

    public function _add()
    {
        $type = explode('/', $_FILES['sale']['type'])[1];
        $exec = md5(time().$_FILES['sale']['name']) . '.' . $type;
        $_POST['sale'] = '/static/img/' . $exec;
        $src = $_FILES['sale']['tmp_name'];
        $dest = realpath('./') . '/static/img/' . $exec;
        move_uploaded_file($src, $dest);
        $list = new adminModel();
        if ($list->musicAdd('album', $_POST)) {
            $this->header('/admin?page=' . $_SESSION['page']);
        };
    }

    //detet
    public function delete_album()
    {
        $data = $_GET['album_id'];
        $list = new adminModel();
        $file = $list->getMusicId('album', $data)['sale'];
        if (!empty($file)) {
            unlink(realpath('./') . $file);
        }
        //删除专辑的同时删除专辑内歌曲
        if ($list->deleteMusic('album', $data)  && $list->datamusic('music', $data)) {
            $this->header('/admin');
        };
    }

    // updata
    public function updata_album()
    {
        $data = new adminModel();
        $MusicList = $data->getMusicId('album', $_GET['album_id']);
        $this->assgin('list', $MusicList);
        $this->display('admin/updata.html');
    }

    public function updateAlbumInfo()
    {
        $data = $_POST['id'];
        $type = explode('/', $_FILES['file']['type'])[1];
        $exec = md5(time().$_FILES['file']['name']) . '.' . $type;
        $where = array(
            'name' => $_POST['name'],
            'album_name' => $_POST['album_name'],
            'sale' => '/static/img/' . $exec
        );
        if (!empty($_FILES['file'])) {
            $src = $_FILES['file']['tmp_name'];
            $dest = realpath('./') . '/static/img/' . $exec;
            move_uploaded_file($src, $dest);
            if (!empty($_POST['sale'])) {
                unlink(realpath('./') . $_POST['sale']);
            }
        } else {
            $where['sale'] = $_POST['sale'];
        }

        $musicUpdate = new adminModel();
        if ($musicUpdate->MusicUpdata('album', $where, $data)) {
            $this->header('/admin');
        };

    }


//音乐
    public function music()
    {
        $method = 'music';
        $music = new adminModel();
        $data = isset($_GET['album_id']) ? $_GET['album_id'] : 1;
        $list = $music->getmusic($data);
        $this->assgin('list', $list);
        include VIEW . 'admin/music.html';
    }

    //add
    public function add_music()
    {
        $method = 'add_music';
        $list = new adminModel();
        $data = $_GET['album_id'];
        $this->assgin('data', $data);
        include VIEW . 'admin/addmusic.html';
    }

    public function check()
    {
        $type = explode('/', $_FILES['file']['type'])[1];
        $filename = md5(time() . $_FILES['file']['name']) . '.' . $type;
        $_POST['src'] = '/static/music/' . $filename;
         if ($type === 'mp3') {
             $src = $_FILES['file']['tmp_name'];
             $dest = realpath('./') . '/static/music/' . $filename;
             move_uploaded_file($src, $dest);
       } else {
             $this->assgin('html', '歌曲格式做错误');
             $this->assgin('url', '/admin/addmusic?album_id=' . $_POST['album_id']);
             $this->display('admin/errec.html');
         }
         $addmusic = new adminModel();
         if ($addmusic->musicAdd('music', $_POST)) {
             $this->header('/admin/music?album_id=' . $_POST['album_id']);
         }
    }

    //delete
    public function dalete_music()
    {
        $data = $_GET['music_id'];
        $a_id = $_GET['album_id'];
        $list = new adminModel();
        $item = $list->getMusicId('music', $data)['src'];
        unlink(realpath('./').$item);
        if ($list->deleteMusic('music', $data)) {
            $this->assgin('html', '删除成功');
            $this->assgin('url', '/admin/music?album_id=' . $a_id);
            $this->display('admin/errec.html');
        };
    }

    //update
    public function update_music()
    {
        $method = 'update_music';
        $updata_music = new adminModel();
        if ($data = $updata_music->setmusic($_GET['music_id'])) {
            $this->assgin('data', $data);
            include VIEW . 'admin/update_music.html';
        };

    }

    public function _add_music()
    {
        $data = $_POST;
        $music_update = new adminModel();
        if ($music_update->set_update_music($data)) {
            $this->header('/admin/music');
        }
    }

}