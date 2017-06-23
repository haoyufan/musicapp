<?php

namespace Core;

class Fromwork
{
    public $arr;

    public static function stite()
    {
        $url = $_SERVER['REQUEST_URI'];
        $arr = explode('/', explode('?', $url)[0]);
        $class_name = isset($arr[2]) ? $arr[2] . 'Controller' : 'indexController';
        $method_name = isset($arr[3]) ? $arr[3] : "index";
        $file = CONTROLLER.$class_name.'.php';
        if(file_exists($file)){
            require  $file;
            $space = '\\app\\Controller\\'.$class_name;
            if(class_exists($space) && method_exists($space,$method_name)){
                $ol = new $space();
                $ol -> $method_name();
            }else{
                include VIEW .('404.html');
            }
        }else{
            include VIEW.('404.html');
        }
    }

    public function findPage($page,$num,$url){
        $prev = ($page -1< 1) ? '#': $url.'?page='.($page-1);
        $html = "<nav><ul class='pagination'><li><a href='{$prev}'><span >&laquo;</span></a></li>";

        for($i=1; $i<= $num; $i++){
            if($i == $page){
                $html .="<li class='active'><a href= {$url}?page={$i}>{$i}</a></li>";
            }else{
                $html .="<li ><a href= {$url}?page={$i}>{$i}</a></li>";

            }
        }
        $next = ($page +1 > $num) ? '#': $url.'?page='.($page +1);
        $html .="<li><a href='{$next}'><span>&raquo;</span></a></li></ul></nav>";
        return $html;
    }

    public  function header($url){
        header('location:/index.php'.$url);
    }

    public function assgin($k,$v){
        $this->arr[$k] = $v;
    }

    public function display($fil){
        $file = VIEW.$fil;
        if(file_exists($file)){
            if(!empty($this->arr)){
                extract($this->arr);
            }
            include $file;
        }else{
            include VIEW.'404.html';
        }
    }

    public function session($k,$v){
        session_start();
        $_SESSION[$k] = $v;
    }

    public function json($arr){
        header('Content-Type:text/json');
        echo json_encode($arr);
    }
}