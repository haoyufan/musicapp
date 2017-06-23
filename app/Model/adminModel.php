<?php

namespace app\Model;

use Core\dbpdo;

class adminModel extends dbpdo
{
    public function __construct()
    {
        parent::__construct();
    }


    public function getALLcat($size, $page, $table)
    {
        $data = ($page - 1) * $size;
        $con = $this->pdo->prepare('select * from ' . $table . ' order by `id` desc limit ' . $size . '  offset ' . $data);
        $con->execute();
        return $con->fetchAll();
    }

    //向一张表中添加数据
    public function musicAdd($table, $data)
    {
        return $this->inseterAdd($table, $data);
    }

    //根据id 获取一条数据
    public function getMusicId($table, $id)
    {
        return $this->fetch($table, $id);
    }
    //改
    public function MusicUpdata($table, $where, $id)
    {
        $data = array(
            'id' => $id
        );
        return $this->update($table, $where, $data);
    }

    //删
    public function deleteMusic($table, $id)
    {
        $where = array(
            "id" => $id,
        );
        return $this->dalete($table, $where);
    }
    //根据albumid 获取数据
    public function getmusic($id)
    {
        $sql = "select music.id,music.name AS m_name,music.src,album.album_name AS al_name ,album.name AS a_name from music,album where music.album_id = ? and album.id = ?";
        $con = $this->pdo->prepare($sql);
        $con->bindValue(1, $id);
        $con->bindValue(2, $id);
        $con->execute();
        return $con->fetchAll();
    }

    //根据id火炬数据
    public function setmusic($id)
    {
        $sql = "select music.id,music.name AS m_name,music.src,album.album_name AS al_name,album.name AS a_name from music,album where music.id = ? and music.album_id = album.id";
        $con = $this->pdo->prepare($sql);
        $con->bindValue(1, $id);
        $con->execute();
        return $con->fetch();
    }
    //修改数据
    public function set_update_music($where)
    {
        $sql = "UPDATE album,music SET music.name =? ,album.album_name=?,album.name=?,music.src= ? WHERE music.id = ? and music.album_id = album.id";
        $con = $this->pdo->prepare($sql);
        $con->bindValue(1, $where['name']);
        $con->bindValue(2, $where['alume_name']);
        $con->bindValue(3, $where['albumname']);
        $con->bindValue(4, $where['src']);
        $con->bindValue(5, $where['id']);
        return $con->execute();
    }
    //获取分页数据
    public function getalbumpage($table)
    {
        $con = $this->pdo->prepare("select count(*) AS num from {$table}");
        $con->execute();
        return $con->fetch()['num'];
    }

    //删除专辑歌曲
    public function datamusic($table,$data){
        $where = array(
            "album_id" => $data,
        );
        return $this->dalete($table,$where);
    }
}