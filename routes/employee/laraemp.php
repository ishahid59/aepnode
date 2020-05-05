   //Server Side Employee VIEW
    public function index(Request $request)
    {
        //$emps = Employee::all();
        // return $emps;

        $query = DB::table('emp_main')
            ->join('list_empjobtitle', 'emp_main.jobtitle', '=', 'list_empjobtitle.listid')
            ->join('list_empregistration', 'emp_main.registration', '=', 'list_empregistration.listid')
            ->select('emp_main.empid', 'emp_main.firstname', 'emp_main.lastname', 'list_empjobtitle.str1 as jobtitle', 'list_empregistration.str1 as registration','emp_main.hiredate')
            ->where('emp_main.empid', '>', '0');



        $totalbeforefilter = $query->count();

        $columns = array(
            0 => 'empid',
            1 => 'firstname',
            2 => 'lastname',
            3 => 'jobtitle',
            4 => 'registration',
            5 => 'hiredate',
        );

        $totalData = Employee::where('EmpID', '>', 0)->count();
        $limit = $request->input('length');
        $start = $request->input('start');
        $order = $columns[$request->input('order.0.column')]; //"empid";//
        $dir = $request->input('order.0.dir');

        $totalFiltered = 0;

        $posts = null;

        //FOR Search
        if (empty($request->input('search.value'))) {
            $totalFiltered = $totalbeforefilter;
        } else {
            $search = $request->input('search.value');
            $query = $query->where('empid', 'like', "%{$search}%")
                ->orWhere('firstname', 'like', "%{$search}%")
                ->orWhere('lastname', 'like', "%{$search}%")
                ->orWhere('list_empjobtitle.str1', 'like', "%{$search}%")
                ->orWhere('list_empregistration.str1', 'like', "%{$search}%");



            $totalFiltered = $query->count();
        }

        $posts = $query
            ->offset($start)
            ->limit($limit)
            ->orderBy($order, $dir)
            ->get(); 

        // $sql = $posts->toSql();
        // return $sql;

        
        $json_data = array(
            // "draw"			=> intval($request->input('draw')),
            "draw"            => $request->input('draw'),
            "recordsTotal"    => intval($totalData),
            "recordsFiltered" => intval($totalFiltered),
            "data"            => $posts,
        );


        echo json_encode($json_data);
    }




    select `emp_main`.`empid`, `emp_main`.`firstname`, `emp_main`.`lastname`, `list_empjobtitle`.`str1` as `jobtitle`, `list_empregistration`.`str1` as `registration`, `emp_main`.`hiredate` from `emp_main` inner join `list_empjobtitle` on `emp_main`.`jobtitle` = `list_empjobtitle`.`listid` inner join `list_empregistration` on `emp_main`.`registration` = `list_empregistration`.`listid` where `emp_main`.`empid` > ? order by `empid` asc limit 10 offset 0



    






    // <>///////////////////////////////////////////////////////////////////////////////////////////
    //Server Side Employee Search
    public function employeesearch(Request $request)
    {
        //$emps = Employee::all();
        // return $emps;
        $firstname = $request->firstname;
        $jobtitle = $request->jobtitle;
        // return $firstname;

        $query = DB::table('emp_main')
            ->join('list_empjobtitle', 'emp_main.jobtitle', '=', 'list_empjobtitle.listid')
            ->join('list_empregistration', 'emp_main.registration', '=', 'list_empregistration.listid')
            ->select('emp_main.empid', 'emp_main.firstname', 'emp_main.lastname', 'list_empjobtitle.str1 as jobtitle', 'list_empregistration.str1 as registration')
            ->where('emp_main.empid', '>', '0');



        $totalbeforefilter = $query->count();

        $columns = array(
            0 => 'empid',
            1 => 'empid',
            2 => 'firstname',
            3 => 'lastname',
            4 => 'jobtitle',
            5 => 'registration',
        );

        $totalData = Employee::where('EmpID', '>', 0)->count();
        $limit = $request->input('length');
        $start = $request->input('start');
        $order = $columns[$request->input('order.0.column')]; //"empid";//
        $dir = $request->input('order.0.dir');

        $totalFiltered = 0;

        $posts = null;

        //FOR Search
        if (!empty($request->input('firstname'))) {
            // $totalFiltered = $totalbeforefilter;
            $firstname = $request->input('firstname');
            $query = $query
                ->where('firstname', 'like', "%{$firstname}%");
        } 
        if (!empty($request->input('lastname'))) {
            $lastname = $request->input('lastname');
            $query = $query
                ->where('lastname', 'like', "%{$lastname}%");  
        } 
        if ($request->jobtitle>0) {
            $jobtitle = $request->input('jobtitle');
            $query = $query
                ->where('emp_main.jobtitle', '=', $jobtitle);                         
        } 
        if ($request->registration>0) {
            $registration = $request->input('registration');
            $query = $query
                ->where('emp_main.registration','=', $registration);                         
        } 
        
        
$totalFiltered = $query->count();
        $posts = $query
            ->offset($start)
            ->limit($limit)
            ->orderBy($order, $dir)
            ->get(); 

        // $sql = $posts->toSql();
        // return $sql;

        
        $json_data = array(
            // "draw"			=> intval($request->input('draw')),
            "draw"            => $request->input('draw'),
            "recordsTotal"    => intval($totalData),
            "recordsFiltered" => intval($totalFiltered),
            "firstname" => $firstname,
            "jobtitle"=>$jobtitle,
            "data"            => $posts,
        );


        echo json_encode($json_data);
    }


