<?php
namespace app\Controller;
require MODEL.'loginModel.php';
use app\Model\loginModel;
use Core\Fromwork;

class loginController extends Fromwork {
    public function index(){
        $method = 'login';
        $m = new loginModel();

        if (isset($_COOKIE['login']))
        {
            $this->session('login',true);
            $this->header('/admin');
        } else
        {
            $this->display('admin/login.html');
        }
    }

    public function check(){
        $user=$_POST['user'];
        $password = md5($_POST['password']);
        $hash = $user.$password;
        $m = new loginModel();
        if($m ->check($user,$password)){
            $this->header('/admin');
            $this->session('login',true);
            setcookie('login',$hash,time()+3600);
        }else{
           $this->display('404.html');
        }
    }

    public function close(){
        session_start();
        unset($_SESSION['login']);
        setcookie('login','123',time()-1);
        $this->display('admin/login.html');
    }
}