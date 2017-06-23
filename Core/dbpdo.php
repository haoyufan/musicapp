<?php

namespace Core;

class dbpdo
{
    public $pdo;

    public function __construct()
    {
        $db = array(
            'dsn' => 'mysql:host=sqld.duapp.com;dbname=nNZkqbmaUZXNZnkAWFBD;port=4050;charset=utf8',
            'username' => 'e9eea8228cc242ddac5a52b3eb2f35a8',
            'password' => 'a07db76f3def4062b6497f3116dea0f1',
        );
        $options = array(
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        );
        try {
            $this->pdo = new \PDO($db['dsn'], $db['username'], $db['password'], $options);
        } catch (\PDOException $e) {
            die('数据库连接失败' . $e->getMessage());
        }
    }
    //查询全部
    public function fetchAll($table)
    {
        $con = $this->pdo->prepare($table);
        $con->execute();
        try {
            return $con->fetchAll();
        } catch (\PDOException $e) {
            die('查询失败' . $e->getMessage());
        }
    }
    //添加
    public function inseterAdd($table, $data)
    {
        $sql = "insert into {$table} (";
        foreach ($data as $k => $v) {
            $sql .= $k . ',';
        }
        $sql = substr($sql, 0, -1);
        $sql .= ")  values (";
        foreach ($data as $k => $v) {
            $sql .= '?,';
        }
        $sql = substr($sql, 0, -1);
        $sql .= ')';
        $con = $this->pdo->prepare($sql);
        for ($i = 1; $i <= count($data); $i++) {
            $arr = array_values($data);
            $con->bindValue($i, $arr[$i - 1]);
        }
        try {
            $con->execute();
            return true;
        } catch (\PDOException $e) {
            die('添加失败' . $e->getMessage());
        }
    }
    //删除
    public function dalete($table, $where)
    {
        $sql = "DELETE  FROM {$table} WHERE ";
        foreach ($where as $k => $v) {
            $sql .= $k . "=" . $v;
        }
        $con = $this->pdo->prepare($sql);
        try {
            $con->execute();
            return true;
        } catch (\PDOException $e) {
            die('删除失败' . $e->getMessage());
        }
    }
    //获取一条
    public function fetch($table,$id)
    {
        $sql = "select * from {$table} WHERE id = {$id}";
        $con = $this->pdo->prepare($sql);
        $con->execute();
        try {
            return $con->fetch();
        } catch (\PDOException $e) {
            die('查询失败' . $e->getMessage());
        }
    }
    //修改
    public function update($table, $where, $data)
    {
        $sql = "update {$table} set ";
        foreach ($where as $k => $v) {
            $sql .= $k . "= ?,";
        }
        $sql = substr($sql,0,-1);
        $sql .=' where ';
        foreach ($data as $k => $v) {
            $sql .= $k . "= ?,";
        }
        $sql = substr($sql,0,-1);
//        echo $sql;
        $con = $this->pdo->prepare($sql);
        for ($i = 1; $i <= count($where); $i++) {
            $arr = array_values($where);
            $con->bindValue($i, $arr[$i - 1]);
        }
        $con->bindValue($i, array_values($data)[0]);
        try {
            return $con->execute();
        } catch (\PDOException $e) {
            die('查询失败' . $e->getMessage());
        }


    }
}