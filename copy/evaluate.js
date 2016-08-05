var filter_column_index = 5;
var initdata1 = [];
var initdata2 = [];
var selectedSettingID = 0;
var selectedSettingID2=0;
var EvaluatePage = function() {
    var toastrInit = function() {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "positionClass": "toast-top-center",
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    };
    var pageInit = function() {
        require.config({
            paths: {
                echarts: '/public/library/echarts'
            }
        });
        bootbox.setDefaults('locale', 'zh_CN');
        $("a[href='#tab_3']").on("click", function() {
            $("#page-date-range").hide(300);
            $("#ss").css('color', 'red');
        });
        $("a[href='#tab_2']").on("click", function() {
            $("#page-date-range").show();
        });
        $("a[href='#tab_1']").on("click", function() {
            $("#page-date-range").show();
        });
        $('#btn-filter-unevaluated').on('click', function() {
            table.DataTable().column(filter_column_index).search("未评价").draw();
        });
        $('#btn-filter-evaluated').on('click', function() {
            table.DataTable().column(filter_column_index).search("已评价").draw();
        });
        $('#btn-filter-accepted').on('click', function() {
            table.DataTable().column(filter_column_index).search("已采纳").draw();
        });
        $('#btn-filter-clear').on('click', function() {
            table.DataTable().column(filter_column_index).search("").draw();
        });
        $(".level,.awardRate").numeric();
    };
    var init_editable = function() {
        $('a.award').each(function() {
            $.fn.editable.defaults.inputclass = 'form-control';
            $.fn.editable.defaults.emptytext = '已恢复默认值';
            var setting_type = $(this).attr('data-field-type');
            $(this).editable({
                url: "/evaluate/review-setting/save",
                validate: function(value) {
                    if (value == '') {
                        return;
                    }
                    if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
                        return '请检查你输入的数据';
                    }
                },
                send: 'always',
                params: function(params) {
                    params.settingType = setting_type;
                    params.csrf_token = token;
                    return params;
                },
                success: function(response, newValue) {
                    if (response.Code != '00') {
                        bootbox.alert(response.Message);
                    } else {
                        if (newValue == '') {
                            $(this).addClass("editable-deleted");
                        }
                    }
                }
            });
        });
        $('a.lowest-rate').each(function() {
            var setting_type = $(this).attr('data-field-type');
            $(this).editable({
                url: "/evaluate/staff-setting/lowest-rate/save",
                validate: function(value) {
                    if (value == '') {
                        return;
                    }
                    if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
                        return '请检查你输入的数据';
                    }
                    if (value > 1) {
                        return '默认系数不能大于1';
                    }
                },
                send: 'always',
                params: function(params,value) {
                    params.saveType = setting_type;
                    params.csrf_token = token;
                    return params;
                },
                success: function(response, newValue) {
                    if (response.Code != '00') {
                        bootbox.alert(response.Message);
                    } else {
                        if (newValue == '') {
                            $(this).addClass("editable-deleted");
                        }
                    }
                }
            });
        });
    };
    var initEvaluateTable = function() {
        table = $('#evalute_list_table');
        oTable = table.dataTable({
            "aLengthMenu": defaultLengthMenu,
            "iDisplayLength": 15,
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource": "/evaluate/list",
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": defaultDatatableLanguage,
            //"DT_RowId": records.CheckoutRecordID,
            "fnServerParams": function(aoData) {
                aoData.push({
                    "name": "from",
                    "value": from
                });
                aoData.push({
                    "name": "to",
                    "value": to
                });
            },
            "columns": [{
                "data": "DT_RowId",
                "title": '',
                "render": function(data, type, full, meta) {
                    return "";
                }
            }, {
                "data": "OrderNo",
                "title": '流水单'
            }, {
                "data": "RecordDate",
                "title": '消费时间'
            }, {
                "data": "MemberName",
                "title": '会员'
            }, {
                "data": "Staffs",
                "title": '服务员工',
                "sortable": false
            }, {
                "data": "EvaluateStatus",
                "title": '评论状态',
                "render": function(data, type, full, meta) {
                    var tmpl = _.template('<span class="label label-<%= style %>"><%= text %></span>');
                    var ret = "";
                    var i = "已评价";
                    var j = "未评价";
                    var k = "已采纳";
                    switch (data) {
                        case i:
                            ret = tmpl({
                                style: 'primary',
                                text: '已评价'
                            });
                            break;
                        case j:
                            ret = tmpl({
                                style: 'success',
                                text: '未评价'
                            });
                            break;
                        case k:
                            ret = tmpl({
                                style: 'warning',
                                text: '已采纳'
                            });
                            break;
                    }
                    return ret;
                }

            }, {
                "data": "EvaluateDate",
                "title": '评论时间',
                "render": function(data, type, full, meta) {
                    if (type === 'display') {
                        if (data != '0001-01-01T00:00:00Z') {
                            var ret = parse_TZ_ISO8601(data, true);
                            return ret;
                        }
                    }
                    return '暂无';
                }
            }],
            "columnDefs": [{
                "orderable": false,
                "targets": [0]
            }],
            "order": [
                [1, 'asc']
            ],
            "lengthMenu": defaultLengthMenu,
            // set the initial value
            "pageLength": defaultPageLength,
            "fnInitComplete": function() {
                $("thead tr", table).addClass("header");
                $(".tooltips", table).tooltip();
            }
        });

        var tableWrapper = $('#evalute_list_table_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper

        /* modify datatable control inputs */
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        var id;
        table.on('click', 'tbody tr td:not(:first-child):not(:last-child)', function() {
            var cid = $(this).parent('tr').attr('id');
            show_evaluate_details(cid);
        });
        // 默认显示已采纳
        table.DataTable().column(filter_column_index).search("已评价").draw();
    };
    var initEvaluateChart = function() {
        // 基于准备好的dom，初始化echarts图表
        require(
            [
                'echarts',
                'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
            ],
            function(ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('evaluate_chart'));
                myChart.showLoading({
                    text: '读取数据中...' //loading话术
                });
                //獲取要使用的數據
                var staffName_data = [];
                var History_data = [];
                var Current_data = [];
                for (idx in staffScores) {
                    staffName_data.push(staffScores[idx].StaffName);
                    History_data.push(staffScores[idx].Score.HistoryAverageGrade / 100);
                    Current_data.push(staffScores[idx].Score.CurrentAverageGrade / 100);
                }
                //無數據顯示
                if (staffName_data.length <= 0) {
                    myChart.showLoading({
                        text: '无数据' //loading话术
                    });
                    return;
                }

                myChart.hideLoading();
                //數據選項
                var option = {
                    title: {
                        text: '员工评分'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['历史平均分', '当前平均分']
                    },
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        data: staffName_data
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '历史平均分',
                        type: 'bar',
                        data: History_data,
                        markPoint: {
                            data: [{
                                type: 'max',
                                name: '最大值'
                            },
                                //{type : 'min', name: '最小值'}
                            ]
                        },
                        barGap: 0
                        //markLine : {
                        //    data : [
                        //        {type : 'average', name: '平均值'}
                        //    ]
                        //}
                    }, {
                        name: '当前平均分',
                        type: 'bar',
                        data: Current_data,
                        markPoint: {
                            data: [{
                                name: '年最高',
                                type: "max"
                            },
                                //{name : '年最低',type:'min'}
                            ]
                        }
                        //markLine : {
                        //    data : [
                        //        {type : 'average', name : '平均值'}
                        //    ]
                        //}
                    }]
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        );

    };
    var initEvaluateTree = function() {
        $.getJSON('/shopsetting/staff/titles', function(data) {
            var staff_data1 = {
                'text': '统一设置',
                'children': [],
                'li_attr': {
                    'data-shoptype-id': 0,
                    'data-stafftype-id': 0,
                    'data-stafftitle-id': 0
                },
                'state': {
                    'opened': true,
                    'selected': true
                }
            };
            var staff_data2 = {
                'text': '统一设置',
                'children': [],
                'li_attr': {
                    'data-shoptype-id': 0,
                    'data-stafftype-id': 0,
                    'data-stafftitle-id': 0
                },
                'state': {
                    'opened': true,
                    'selected': true
                }
            };
            $.getJSON('/evaluate/staff-setting/salary-rules', function(data1) {
                initdata1 = data1;
                gainData1(data, staff_data1);
                $("#tree_3")
                    .jstree({
                        "core": {
                            "themes": {
                                "responsive": false
                            },
                            // so that create works
                            "check_callback": true,
                            'data': staff_data1
                        },
                        "types": {
                            "default": {
                                "icon": "jstree-icon jstree-themeicon fa fa-folder icon-state-default jstree-themeicon-custom"
                            },
                            "hasData": {
                                "icon": "jstree-icon jstree-themeicon fa fa-folder icon-state-success jstree-themeicon-custom"
                            }
                        },
                        "plugins": ["types", "changed"]
                    })
                    .on("changed.jstree", function(e, li) {
                        var elm = $('li#' + li.selected[0]);
                        renderSalaryBody1(elm, data1);
                    });
            });
            $.getJSON('/evaluate/staff-setting/award-rules', function(data2) {
                initdata2 = data2;
                gainData2(data, staff_data2);
                $("#tree_4")
                    .jstree({
                        "core": {
                            "themes": {
                                "responsive": false
                            },
                            // so that create works
                            "check_callback": true,
                            'data': staff_data2
                        },
                        "types": {
                            "default": {
                                "icon": "jstree-icon jstree-themeicon fa fa-folder icon-state-default jstree-themeicon-custom"
                            },
                            "hasData": {
                                "icon": "jstree-icon jstree-themeicon fa fa-folder icon-state-success jstree-themeicon-custom"
                            }
                        },
                        "plugins": ["types", "changed"]
                    })
                    .on("changed.jstree", function(e, li) {
                        var elm = $('li#' + li.selected[0]);
                        renderSalaryBody2(elm, data2);
                    });
            });

            function gainData1(data, staff_data) {
                function hasData(shop_type_id, staff_type_id, staff_title_id) {
                    for (var i = 0; i < initdata1.length; i++) {
                        if (shop_type_id == initdata1[i].ShopTypeID) {
                            if (staff_type_id == initdata1[i].StaffTypeID) {
                                if (staff_title_id == initdata1[i].StaffTitleID) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
                if (hasData(0, 0, 0)) {
                    staff_data.type = "hasData";
                }
                $.each(data, function(ind, el) {
                    var new_data = {
                        'text': el.shop_type_name,
                        'state': {
                            "selected": false,
                            "opened": true
                        },
                        'children': [],
                        'li_attr': {
                            'data-shoptype-id': el.shop_type_id,
                            'data-stafftype-id': 0,
                            'data-stafftitle-id': 0
                        }
                    };
                    if (hasData(el.shop_type_id, 0, 0)) {
                        new_data.type = "hasData";
                    }
                    $.each(el.titles, function(ind1, el1) {
                        var next_data = {
                            'text': el1.staff_type_name,
                            'state': {
                                "selected": false,
                                "opened": false
                            },
                            'children': [],
                            'li_attr': {
                                'data-shoptype-id': el.shop_type_id,
                                'data-stafftype-id': el1.staff_type_id,
                                'data-stafftitle-id': 0
                            }
                        };
                        if (hasData(el.shop_type_id, el1.staff_type_id, 0)) {
                            next_data.type = "hasData";
                        }
                        $.each(el1.staff_titles, function(ind2, el2) {
                            var last_data = {
                                'text': el2.StaffTitle,
                                'state': {
                                    "selected": false
                                },
                                'li_attr': {
                                    'data-shoptype-id': el.shop_type_id,
                                    'data-stafftype-id': el1.staff_type_id,
                                    'data-stafftitle-id': el2.ID
                                }
                            };
                            if (hasData(el.shop_type_id, el1.staff_type_id, el2.ID)) {
                                last_data.type = "hasData";
                            }
                            next_data.children.push(last_data);
                        });
                        new_data.children.push(next_data);
                    });
                    staff_data.children.push(new_data);
                });
            }

            function gainData2(data, staff_data) {
                function hasData(shop_type_id, staff_type_id, staff_title_id) {
                    for (var i = 0; i < initdata2.length; i++) {
                        if (shop_type_id == initdata2[i].ShopTypeID) {
                            if (staff_type_id == initdata2[i].StaffTypeID) {
                                if (staff_title_id == initdata2[i].StaffTitleID) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
                if (hasData(0, 0, 0)) {
                    staff_data.type = "hasData";
                }
                $.each(data, function(ind, el) {
                    var new_data = {
                        'text': el.shop_type_name,
                        'state': {
                            "selected": false,
                            "opened": true
                        },
                        'children': [],
                        'li_attr': {
                            'data-shoptype-id': el.shop_type_id,
                            'data-stafftype-id': 0,
                            'data-stafftitle-id': 0
                        }
                    };
                    if (hasData(el.shop_type_id, 0, 0)) {
                        new_data.type = "hasData";
                    }
                    $.each(el.titles, function(ind1, el1) {
                        var next_data = {
                            'text': el1.staff_type_name,
                            'state': {
                                "selected": false,
                                "opened": false
                            },
                            'children': [],
                            'li_attr': {
                                'data-shoptype-id': el.shop_type_id,
                                'data-stafftype-id': el1.staff_type_id,
                                'data-stafftitle-id': 0
                            }
                        };
                        if (hasData(el.shop_type_id, el1.staff_type_id, 0)) {
                            next_data.type = "hasData";
                        }
                        $.each(el1.staff_titles, function(ind2, el2) {
                            var last_data = {
                                'text': el2.StaffTitle,
                                'state': {
                                    "selected": false
                                },
                                'li_attr': {
                                    'data-shoptype-id': el.shop_type_id,
                                    'data-stafftype-id': el1.staff_type_id,
                                    'data-stafftitle-id': el2.ID
                                }
                            };
                            if (hasData(el.shop_type_id, el1.staff_type_id, el2.ID)) {
                                last_data.type = "hasData";
                            }
                            next_data.children.push(last_data);
                        });
                        new_data.children.push(next_data);
                    });
                    staff_data.children.push(new_data);
                });
            }

        });
    };
    var renderSalaryBody1 = function(el, ruleData) {
        $('.salary_box').hide().show(300);
        var newStateData;
        var shoptype_id = el.attr('data-shoptype-id');
        var stafftype_id = el.attr('data-stafftype-id');
        var stafftitle_id = el.attr('data-stafftitle-id');
        newStateData = {
            "ID": 0,
            "ShopTypeID": shoptype_id,
            "StaffTypeID": stafftype_id,
            "StaffTitleID": stafftitle_id,
            "Rules": [],
            "EvaluateSettings": []
        };
        selectedSettingID=0;
        for (var idx in ruleData) {
            if (shoptype_id == ruleData[idx].ShopTypeID) {
                if (stafftype_id == ruleData[idx].StaffTypeID) {
                    if (stafftitle_id == ruleData[idx].StaffTitleID) {
                        ruleData[idx].Rules = _.sortBy(ruleData[idx].Rules, "level");
                        newStateData = ruleData[idx];
                        selectedSettingID = newStateData.ID;
                        break;
                    }
                }
            }
        }
        renderSalary1(newStateData);
    };
    var renderSalaryBody2 = function(el, ruleData) {
        $('.award_box').hide().show(300);
        var newStateData;
        var shoptype_id = el.attr('data-shoptype-id');
        var stafftype_id = el.attr('data-stafftype-id');
        var stafftitle_id = el.attr('data-stafftitle-id');
        newStateData = {
            "ID": 0,
            "ShopTypeID": shoptype_id,
            "StaffTypeID": stafftype_id,
            "StaffTitleID": stafftitle_id,
            "Rules": [],
            "EvaluateSettings": []
        };
        selectedSettingID2=0;
        for (var idx in ruleData) {
            if (shoptype_id == ruleData[idx].ShopTypeID) {
                if (stafftype_id == ruleData[idx].StaffTypeID) {
                    if (stafftitle_id == ruleData[idx].StaffTitleID) {
                        ruleData[idx].Rules = _.sortBy(ruleData[idx].Rules, "level");
                        newStateData = ruleData[idx];
                        selectedSettingID2=newStateData.ID;
                        break;
                    }
                }
            }
        }
        renderSalary2(newStateData);
    };
    var renderSalary1 = function(data) {
        var out = "";
        var out1 = "";
        //set the data.rules reverse;
        data.Rules.sort(function(x,y){return x['grade']-y['grade']}).reverse();
        if (data.Rules != null) {
            for (var i = 0; i < data.Rules.length; i++) {
                out += "<tr>";
                out += "<td>";
                out += data.Rules[i].grade / 100;
                out += "</td>";
                out += "<td>";
                out += data.Rules[i].rate / 100;
                out += "</td>";
                out += "<td>";
                out += "<a class='btn btn-link btn-xs btn-inline-link salary-delete' rel=" + data.Rules[i].id + ">删除</a>";
                out += "</td>";
                out += "</tr>";
            }
        }
        var html1 = '<a class="money"  data-state="true"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="0" data-ty="1" data-pk="" data-original-title="条件设置">' + 0 + '</a>';
        var html2 = '<a class="money"  data-state="true" data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="0" data-ty="2" data-pk="" data-original-title="条件设置">' + 0 + '</a>';
        var html3 = '<a class="money"  data-state="true"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="0" data-ty="3" data-pk="" data-original-title="条件设置">' + 0 + '</a>';
        var html4 = '<a class="money"  data-state="true"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="0" data-ty="4" data-pk="" data-original-title="条件设置">' + 0 + '</a>';
        if (data.EvaluateSettings && data.EvaluateSettings.length > 0) {
            for (i in data.EvaluateSettings) {
                var number_money ='';
                var judge = function() {
                    number_money = data.EvaluateSettings[i].NumberOrMoney;
                    if (data.EvaluateSettings[i].ByNumber == false) {
                        return false;
                    } else {
                        return true;
                    }
                };
                var input_html = '<input type="checkbox" class="make-switch switch1"  data-size="small" data-on-text="按个数" data-off-text="按金额" data-on-color="primary" data-off-color="success">';
                var input_html2 = '<input type="checkbox" checked class="make-switch switch1"  data-size="small" data-on-text="按个数" data-off-text="按金额" data-on-color="primary" data-off-color="success">';
                if (data.EvaluateSettings[i].Type == 1) {
                    var result = judge();
                    if (result == false) {
                        $('#reward .product_switch').html(input_html);
                    } else {
                        $('#reward .product_switch').html(input_html2);
                    }
                    html1 = '<a class="money" data-state="' + result + '" data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + data.EvaluateSettings[i].ID + '" data-ty="1" data-pk="0" data-original-title="条件设置">' + number_money + '</a>';
                } else if (data.EvaluateSettings[i].Type == 2) {
                    var result = judge();
                    if (result == false) {
                        $('#reward .package_switch').html(input_html);
                    } else {
                        $('#reward .package_switch').html(input_html2);
                    }
                    html2 = '<a class="money" data-state="' + result + '"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + data.EvaluateSettings[i].ID + '" data-ty="2" data-pk="0" data-original-title="条件设置">' + number_money + '</a>';
                } else if (data.EvaluateSettings[i].Type == 3) {
                    var result = judge();
                    if (result == false) {
                        $('#reward .card_switch').html(input_html);
                    } else {
                        $('#reward .card_switch').html(input_html2);
                    }
                    html3 = '<a class="money" data-state="' + result + '"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + data.EvaluateSettings[i].ID + '" data-ty="3" data-pk="0" data-original-title="条件设置">' + number_money + '</a>';
                } else if (data.EvaluateSettings[i].Type == 4) {
                    var result = judge();
                    if (result == false) {
                        $('#reward .charge_switch').html(input_html);
                    } else {
                        $('#reward .charge_switch').html(input_html2);
                    }
                    html4 = '<a class="money" data-state="' + result + '"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + data.EvaluateSettings[i].ID + '" data-ty="4" data-pk="0" data-original-title="条件设置">' + number_money + '</a>';
                }
            }
        }
        var fun = function(serviceid) {
            var number_money = 0;
            var e_id = 0;
            var bool = true;
            for (i in data.EvaluateSettings) {
                if (data.EvaluateSettings[i].ServiceTypeID == serviceid && data.EvaluateSettings[i].Type == 0) {
                    e_id = data.EvaluateSettings[i].ID;
                    bool = data.EvaluateSettings[i].ByNumber;
                    number_money = data.EvaluateSettings[i].NumberOrMoney;
                    if (data.EvaluateSettings[i].ByNumber == false) {
                        bool = false;
                    } else {
                        bool = true;
                    }
                }
            }
            return [number_money, e_id, bool];
        };
        for (idx1 in shopTypes) {
            if (data.ShopTypeID == shopTypes[idx1].ShopTypeID) {
                var firstname = shopTypes[idx1].ShopTypeName;
                for (idx2 in shopTypes[idx1].ServiceTypes) {
                    var lastname = shopTypes[idx1].ServiceTypes[idx2].ServiceTypeName;
                    var obj = fun(shopTypes[idx1].ServiceTypes[idx2].ServiceTypeID);
                    out1 += "<tr class='e_tr'>";
                    out1 += "<td>";
                    out1 += firstname + '-' + lastname;
                    out1 += "</td>";
                    if (obj[2] == true) {
                        out1 += "<td>";
                        out1 += '<input type="checkbox" checked class="make-switch" data-size="small" data-on-text="按个数" data-off-text="按金额" data-on-color="primary" data-off-color="success">';
                        out1 += "</td>";
                    } else {
                        out1 += "<td>";
                        out1 += '<input type="checkbox" class="make-switch"  data-size="small" data-on-text="按个数" data-off-text="按金额" data-on-color="primary" data-off-color="success">';
                        out1 += "</td>";
                    }
                    out1 += "<td>";
                    out1 += '<a  data-state="' + obj[2] + '" class="money" data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '"  data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + obj[1] + '" data-ty="0" data-pk="' + shopTypes[idx1].ServiceTypes[idx2].ServiceTypeID + '" data-original-title="条件设置">';
                    out1 += obj[0];
                    out1 += "</a></td>";
                    out1 += "</tr>";
                }
                break;
            }
        }
        $('#reward .y_product').html(html1);
        $('#reward .y_package').html(html2);
        $('#reward .y_card').html(html3);
        $('#reward .y_charge').html(html4);
        $("#reward .e_tr").remove();
        $("#reward").append(out1);
        $("#reward .make-switch").bootstrapSwitch();
        $('#reward .make-switch').on('switchChange.bootstrapSwitch', function(event, state) {
            $(this).parent().parent().parent().parent().find('a').attr('data-state', state);
            var tr=$(this).parent().parent().parent().parent().find('a');
            var url="/evaluate/staff-setting/salary-setting/save";
            var serviceTypeID = tr.attr('data-pk');
            var id = tr.attr('data-id');
            var type = tr.attr('data-ty');
            var settingID = tr.attr('data-settingID');
            var shoptypeID = tr.attr('data-shoptypeID');
            var stafftypeID = tr.attr('data-stafftypeID');
            var stafftitleID = tr.attr('data-stafftitleID');
            var fillvalue=tr.text();
            var newdatas={
                id : id,
                csrf_token : token,
                settingID : settingID,
                serviceTypeID : serviceTypeID,
                shopTypeID  : shoptypeID,
                byNumber  : state,
                ty :  type,
                staffTypeId : stafftypeID,
                staffTitleId : stafftitleID,
                value:fillvalue
            }
            if(fillvalue==0){
                return;
            }
            $.post(url, newdatas, function(resp) {
                if (resp.Code != '00') {
                    bootbox.alert(resp.Message);
                }else {
                    var newData = data;
                    var newsetting = {
                        'ID': resp.Data[0].EvaluateID,
                        'StaffSalarySettingID': resp.Data[0].SettingID,
                        'ServiceTypeID': parseInt(serviceTypeID),
                        'ShopTypeID': parseInt(shoptypeID),
                        'NumberOrMoney': fillvalue,
                        'ByNumber': state,
                        'Type': parseInt(type)

                    };
                    var newsettings = newData.EvaluateSettings.concat([newsetting]);
                    newData.EvaluateSettings = newsettings;
                    if (newData.ID == 0) {
                        newData.ID = resp.Data[0].SettingID;
                        initdata1.push(newData);
                    }
                    // re-render
                    //renderSalary1(newData);
                }
            }, "json");
        });
        $('a.money').each(function() {
            var serviceTypeID = $(this).attr('data-pk');
            var id = $(this).attr('data-id');
            var type = $(this).attr('data-ty');
            var settingID = $(this).attr('data-settingID');
            var shoptypeID = $(this).attr('data-shoptypeID');
            var stafftypeID = $(this).attr('data-stafftypeID');
            var stafftitleID = $(this).attr('data-stafftitleID');
            var num_state = $(this).attr('data-state');
            $(this).editable({
                url: "/evaluate/staff-setting/salary-setting/save",
                inputclass: 'editable_class',
                validate: function(value) {
                    if (value == '') {
                        return;
                    }
                    if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
                        return '请检查你输入的数据';
                    }
                    if (value > 9999999) {
                        return '请检查你输入的数据';
                    }

                },
                send: 'always',
                params: function(params) {
                    if(params.value==""){
                        params.value=0;
                    }
                    params.id = id;
                    params.csrf_token = token;
                    params.settingID = selectedSettingID;
                    params.serviceTypeID = serviceTypeID;
                    params.shopTypeID = shoptypeID;
                    params.byNumber = $(this).attr('data-state');
                    params.ty = type;
                    params.staffTypeId = stafftypeID;
                    params.staffTitleId = stafftitleID;
                    return params;
                },
                success: function(response, newValue) {
                    if (response.Code != '00') {
                        bootbox.alert(response.Message);
                    } else {
                        selectedSettingID=response.Data[0].SettingID;
                        var newData = data;
                        var byNumberStr = $(this).attr('data-state');
                        var byNumber;
                        var fillvalue = newValue;
                        if (byNumberStr == "false") {
                            byNumber = false;
                            fillvalue = newValue;
                        } else {
                            byNumber = true;
                        }
                        var newsetting = {
                            'ID': response.Data[0].EvaluateID,
                            'StaffSalarySettingID': response.Data[0].SettingID,
                            'ServiceTypeID': parseInt(serviceTypeID),
                            'ShopTypeID': parseInt(shoptypeID),
                            'NumberOrMoney': fillvalue,
                            'ByNumber': byNumber,
                            'Type': parseInt(type)

                        };

                        var newsettings = newData.EvaluateSettings.concat([newsetting]);
                        newData.EvaluateSettings = newsettings;
                        if (newData.ID == 0) {
                            newData.ID = response.Data[0].SettingID;
                            initdata1.push(newData);
                        }
                        // re-render
                        renderSalary1(newData);
                        if (newValue == '') {
                            $(this).addClass("editable-deleted");
                        }
                    }
                }
            });
        });

        $("#salary").empty().html(out);
        $('#salary-save,.salary-delete').unbind();
        $('#salary-save').on('click', function() {
            var url = '/evaluate/staff-setting/salary-rule/save';
            var bt = $(this);
            saveRules(url, bt);
        });
        $('.salary-delete').on('click', function() {
            var url = '/evaluate/staff-setting/salary-rule/remove';
            var bt = $(this);
            deleteRules(url, bt);
        });

        function saveRules(url, bt) {
            var level = $('.salary_box').find('input.level').val();
            var awardRate = $('.salary_box').find('input.awardRate').val();
            if (!level || !awardRate) {
                toastr['warning']('请输入数据');
                $(".save-rule").button("reset");
                return;
            }
            //工资浮动系数需大于下阶系数
            var fil_arr1=_.filter(data.Rules,function(item){
                return item['grade']<level*100;
            });
            var fil_arr2=_.filter(data.Rules,function(item){
                return item['grade']>level*100;
            });
            var max_arr=_.max(fil_arr1, function(item){
                return item.grade;
            });
            var min_arr=_.min(fil_arr2, function(item){
                return item.grade;
            });
            if(awardRate<=max_arr.rate/100){
                bootbox.alert('工资浮动系数需大于下阶系数！！');
                return;
            }
            if(awardRate>=min_arr.rate/100){
                bootbox.alert('工资浮动系数需小于于上阶系数！！');
                return;
            }
            var rule = {
                'id': selectedSettingID,
                'ruleId': 0,
                'shopTypeId': data.ShopTypeID,
                'staffTypeId': data.StaffTypeID,
                'staffTitleId': data.StaffTitleID,
                'level': level,
                'awardRate': awardRate,
                'csrf_token': token
            };
            $.post(url, rule, function(resp) {
                if (resp.Code != '00') {
                    bootbox.alert(resp.Message);
                } else {
                    selectedSettingID=resp.Data[0].SettingID;
                    toastr['success'](resp.Message);
                    var newData = data;
                    var newRule = {
                        'id': resp.Data[0].RuleID,
                        'Staff_salary_setting_id': data.ID,
                        'grade': rule.level * 100,
                        'rate': rule.awardRate * 100
                    };
                    var newRules = newData.Rules.concat([newRule]);
                    newData.Rules = newRules;
                    newData.Rules = _.sortBy(newData.Rules, "grade").reverse();
                    if (newData.ID == 0) {
                        newData.ID = selectedSettingID;
                        initdata1.push(newData);
                    }
                    // re-render
                    renderSalary1(newData);
                    if (newData.Rules.length == 1) {
                        $("#tree_3").find('a.jstree-clicked i').removeClass('icon-state-default').addClass('icon-state-success');
                    }
                }
                $('input.level').val('');
                $('input.awardRate').val('');
            }, "json");
        }

        function deleteRules(url, bt) {
            var rule_id = bt.attr("rel");
            var delete_data = {
                'ruleId': rule_id,
                'csrf_token': token
            };
            $.post(url, delete_data, function(resp) {
                if (resp.Code != '00') {
                    // alert(resp.Message);
                    bootbox.alert(resp.Message);
                } else {
                    toastr['success'](resp.Message);
                    selectedSettingID=resp.ID;
                    var newData = data;
                    for (var idx in newData.Rules) {
                        if (newData.Rules[idx].id == rule_id) {
                            newData.Rules.splice(idx, 1);
                        }
                    }
                    if (newData.Rules.length <= 0) {
                        $("#tree_3").find('a.jstree-clicked i').removeClass('icon-state-success').addClass('icon-state-default');
                        newData.ID = 0;
                    }
                    // re-render
                    renderSalary1(newData);
                }
            }, 'json')
        }
    };
    var renderSalary2 = function(data) {
        var out = "";
        var out1 = "";
        //set the data.rules reverse;
        data.Rules.sort(function(x,y){return x['grade']-y['grade']}).reverse();
        if (data.Rules != null) {
            for (var i = 0; i < data.Rules.length; i++) {
                out += "<tr>";
                out += "<td >";
                out += data.Rules[i].grade / 100;
                out += "</td>";
                out += "<td>";
                out += data.Rules[i].rate / 100;
                out += "</td>";
                out += "<td>";
                out += "<a class='btn btn-link btn-xs btn-inline-link award-delete' rel=" + data.Rules[i].id + ">删除</a>";
                out += "</td>";
                out += "</tr>";
            }
        }
        var html1 = '<a class="money"  data-state="true"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="0" data-ty="1" data-pk="" data-original-title="条件设置">' + 0 + '</a>';
        var html2 = '<a class="money"  data-state="true" data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="0" data-ty="2" data-pk="" data-original-title="条件设置">' + 0 + '</a>';
        var html3 = '<a class="money"  data-state="true"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="0" data-ty="3" data-pk="" data-original-title="条件设置">' + 0 + '</a>';
        var html4 = '<a class="money"  data-state="true"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="0" data-ty="4" data-pk="" data-original-title="条件设置">' + 0 + '</a>';
        if (data.EvaluateSettings && data.EvaluateSettings.length > 0) {
            for (i in data.EvaluateSettings) {
                var number_money = '';
                var judge = function() {
                    number_money = data.EvaluateSettings[i].NumberOrMoney;
                    if (data.EvaluateSettings[i].ByNumber == false) {
                        return false;
                    } else {
                        return true;
                    }
                };
                var input_html = '<input type="checkbox" class="make-switch switch1"  data-size="small" data-on-text="按个数" data-off-text="按金额" data-on-color="primary" data-off-color="success">';
                var input_html2 = '<input type="checkbox" checked class="make-switch switch1"  data-size="small" data-on-text="按个数" data-off-text="按金额" data-on-color="primary" data-off-color="success">';
                if (data.EvaluateSettings[i].Type == 1) {
                    var result = judge();
                    if (result == false) {
                        $('#reward_award .product_switch').html(input_html);
                    } else {
                        $('#reward_award .product_switch').html(input_html2);
                    }
                    html1 = '<a class="money" data-state="' + result + '" data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + data.EvaluateSettings[i].ID + '" data-ty="1" data-pk="0" data-original-title="条件设置">' + number_money + '</a>';
                } else if (data.EvaluateSettings[i].Type == 2) {
                    var result = judge();
                    if (result == false) {
                        $('#reward_award .package_switch').html(input_html);
                    } else {
                        $('#reward_award .package_switch').html(input_html2);
                    }
                    html2 = '<a class="money" data-state="' + result + '"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + data.EvaluateSettings[i].ID + '" data-ty="2" data-pk="0" data-original-title="条件设置">' + number_money + '</a>';
                } else if (data.EvaluateSettings[i].Type == 3) {
                    var result = judge();
                    if (result == false) {
                        $('#reward_award .card_switch').html(input_html);
                    } else {
                        $('#reward_award .card_switch').html(input_html2);
                    }
                    html3 = '<a class="money" data-state="' + result + '"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + data.EvaluateSettings[i].ID + '" data-ty="3" data-pk="0" data-original-title="条件设置">' + number_money + '</a>';
                } else if (data.EvaluateSettings[i].Type == 4) {
                    var result = judge();
                    if (result == false) {
                        $('#reward_award .charge_switch').html(input_html);
                    } else {
                        $('#reward_award .charge_switch').html(input_html2);
                    }
                    html4 = '<a class="money" data-state="' + result + '"  data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '" data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + data.EvaluateSettings[i].ID + '" data-ty="4" data-pk="0" data-original-title="条件设置">' + number_money + '</a>';
                }
            }
        }
        var fun = function(serviceid) {
            var number_money = 0;
            var e_id = 0;
            var bool = true;
            for (i in data.EvaluateSettings) {
                if (data.EvaluateSettings[i].ServiceTypeID == serviceid && data.EvaluateSettings[i].Type == 0) {
                    e_id = data.EvaluateSettings[i].ID;
                    bool = data.EvaluateSettings[i].ByNumber;
                    number_money = data.EvaluateSettings[i].NumberOrMoney;
                    if (data.EvaluateSettings[i].ByNumber == false) {
                        bool = false;

                    } else {
                        bool = true;
                    }
                }
            }
            return [number_money, e_id, bool];
        };
        for (idx1 in shopTypes) {
            if (data.ShopTypeID == shopTypes[idx1].ShopTypeID) {
                var firstname = shopTypes[idx1].ShopTypeName;
                for (idx2 in shopTypes[idx1].ServiceTypes) {
                    var lastname = shopTypes[idx1].ServiceTypes[idx2].ServiceTypeName;
                    var obj = fun(shopTypes[idx1].ServiceTypes[idx2].ServiceTypeID);
                    out1 += "<tr class='e_tr'>";
                    out1 += "<td>";
                    out1 += firstname + '-' + lastname;
                    out1 += "</td>";
                    if (obj[2] == true) {
                        out1 += "<td>";
                        out1 += '<input type="checkbox" checked class="make-switch" data-size="small" data-on-text="按个数" data-off-text="按金额" data-on-color="primary" data-off-color="success">';
                        out1 += "</td>";
                    } else {
                        out1 += "<td>";
                        out1 += '<input type="checkbox" class="make-switch"  data-size="small" data-on-text="按个数" data-off-text="按金额" data-on-color="primary" data-off-color="success">';
                        out1 += "</td>";
                    }
                    out1 += "<td>";
                    out1 += '<a  data-state="' + obj[2] + '" class="money" data-stafftypeID="' + data.StaffTypeID + '" data-stafftitleID="' + data.StaffTitleID + '"  data-shoptypeID="' + data.ShopTypeID + '" data-settingID="' + data.ID + '" data-type="text" data-id="' + obj[1] + '" data-ty="0" data-pk="' + shopTypes[idx1].ServiceTypes[idx2].ServiceTypeID + '" data-original-title="条件设置">';
                    out1 += obj[0];
                    out1 += "</a></td>";
                    out1 += "</tr>";
                }
                break;
            }
        }
        $('#reward_award .y_product').html(html1);
        $('#reward_award .y_package').html(html2);
        $('#reward_award .y_card').html(html3);
        $('#reward_award .y_charge').html(html4);
        $("#reward_award .e_tr").remove();
        $("#reward_award").append(out1);
        $("#reward_award .make-switch").bootstrapSwitch();
        $('#reward_award .make-switch').on('switchChange.bootstrapSwitch', function(event, state) {
            $(this).parent().parent().parent().parent().find('a').attr('data-state', state);
            var tr=$(this).parent().parent().parent().parent().find('a');
            var url="/evaluate/staff-setting/award-setting/save";
            var serviceTypeID = tr.attr('data-pk');
            var id = tr.attr('data-id');
            var type = tr.attr('data-ty');
            var settingID = tr.attr('data-settingID');
            var shoptypeID = tr.attr('data-shoptypeID');
            var stafftypeID = tr.attr('data-stafftypeID');
            var stafftitleID = tr.attr('data-stafftitleID');
            var fillvalue=tr.text();
            var newdatas={
                id : id,
                csrf_token : token,
                settingID : settingID,
                serviceTypeID : serviceTypeID,
                shopTypeID  : shoptypeID,
                byNumber  : state,
                ty :  type,
                staffTypeId : stafftypeID,
                staffTitleId : stafftitleID,
                value:fillvalue
            }
            if(fillvalue==0){
                return;
            }
            $.post(url, newdatas, function(resp) {
                if (resp.Code != '00') {
                    bootbox.alert(resp.Message);
                }else {
                    var newData = data;
                    var newsetting = {
                        'ID': resp.Data[0].EvaluateID,
                        'StaffSalarySettingID': resp.Data[0].SettingID,
                        'ServiceTypeID': parseInt(serviceTypeID),
                        'ShopTypeID': parseInt(shoptypeID),
                        'NumberOrMoney': fillvalue,
                        'ByNumber': state,
                        'Type': parseInt(type)

                    };
                    var newsettings = newData.EvaluateSettings.concat([newsetting]);
                    newData.EvaluateSettings = newsettings;
                    if (newData.ID == 0) {
                        newData.ID = resp.Data[0].SettingID;
                        initdata2.push(newData);
                    }
                    // re-render
                    //renderSalary1(newData);
                }
            }, "json");
        });
        $('a.money').each(function() {
            var serviceTypeID = $(this).attr('data-pk');
            var id = $(this).attr('data-id');
            var type = $(this).attr('data-ty');
            var settingID = $(this).attr('data-settingID');
            var shoptypeID = $(this).attr('data-shoptypeID');
            var stafftypeID = $(this).attr('data-stafftypeID');
            var stafftitleID = $(this).attr('data-stafftitleID');
            var num_state = $(this).attr('data-state');
            $(this).editable({
                url: "/evaluate/staff-setting/award-setting/save",
                inputclass: 'editable_class',
                validate: function(value) {
                    if (value == '') {
                        return;
                    }
                    if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
                        return '请检查你输入的数据';
                    }
                    if (value > 9999999) {
                        return '请检查你输入的数据';
                    }
                },
                send: 'always',
                params: function(params) {
                    if(params.value==""){
                        params.value=0;
                    }
                    params.id = id;
                    params.csrf_token = token;
                    params.settingID = selectedSettingID2;
                    params.serviceTypeID = serviceTypeID;
                    params.shopTypeID = shoptypeID;
                    params.byNumber = $(this).attr('data-state');
                    params.ty = type;
                    params.staffTypeId = stafftypeID;
                    params.staffTitleId = stafftitleID;
                    return params;
                },
                success: function(response, newValue) {
                    if (response.Code != '00') {
                        bootbox.alert(response.Message);
                    } else {
                        selectedSettingID2=response.Data[0].SettingID;
                        var newData = data;
                        var byNumberStr = $(this).attr('data-state');
                        var byNumber;
                        var fillvalue = newValue;
                        if (byNumberStr == "false") {
                            byNumber = false;
                            fillvalue = newValue;
                        } else {
                            byNumber = true;
                        }
                        var newsetting = {
                            'ID': response.Data[0].EvaluateID,
                            'StaffSalarySettingID': response.Data[0].SettingID,
                            'ServiceTypeID': parseInt(serviceTypeID),
                            'ShopTypeID': parseInt(shoptypeID),
                            'NumberOrMoney': fillvalue,
                            'ByNumber': byNumber,
                            'Type': parseInt(type)

                        };
                        var newsettings = newData.EvaluateSettings.concat([newsetting]);
                        newData.EvaluateSettings = newsettings;
                        if (newData.ID == 0) {
                            newData.ID = response.Data[0].SettingID;
                            initdata2.push(newData);
                        }
                        // re-render
                        renderSalary2(newData);
                        if (newValue == '') {
                            $(this).addClass("editable-deleted");
                        }
                    }
                }
            });
        });

        $("#award").empty().html(out);
        $('#award-save,.award-delete').unbind();
        $('#award-save').on('click', function() {
            var url = '/evaluate/staff-setting/award-rule/save';
            var bt = $(this);
            saveRules2(url, bt);
        });
        $('.award-delete').on('click', function() {
            var url = '/evaluate/staff-setting/award-rule/remove';
            var bt = $(this);
            deleteRules2(url, bt);
        });

        function saveRules2(url, bt) {
            var level = bt.parent().parent().find('input.level').val();
            var awardRate = bt.parent().parent().find('input.awardRate').val();
            if (!level || !awardRate) {
                toastr['warning']('请输入数据');
                $(".save-rule").button("reset");
                return;
            }
            //提成浮动系数需大于下阶系数
            var fil_arr1=_.filter(data.Rules,function(item){
                return item['grade']<level*100;
            });
            var fil_arr2=_.filter(data.Rules,function(item){
                return item['grade']>level*100;
            });
            var max_arr=_.max(fil_arr1, function(item){
                return item.grade;
            });
            var min_arr=_.min(fil_arr2, function(item){
                return item.grade;
            });
            if(awardRate<=max_arr.rate/100){
                bootbox.alert('工资浮动系数需大于下阶系数！！');
                return;
            }
            if(awardRate>=min_arr.rate/100){
                bootbox.alert('工资浮动系数需小于于上阶系数！！');
                return;
            }
            var rule = {
                'id': selectedSettingID2,
                'ruleId': 0,
                'shopTypeId': data.ShopTypeID,
                'staffTypeId': data.StaffTypeID,
                'staffTitleId': data.StaffTitleID,
                'level': level,
                'awardRate': awardRate,
                'csrf_token': token
            };
            $.post(url, rule, function(resp) {
                if (resp.Code != '00') {
                    bootbox.alert(resp.Message);
                } else {
                    toastr['success'](resp.Message);
                    selectedSettingID2=resp.Data[0].SettingID;
                    var newData = data;
                    var newRule = {
                        'id': resp.Data[0].RuleID,
                        'Staff_salary_setting_id': data.ID,
                        'grade': rule.level * 100,
                        'rate': rule.awardRate * 100
                    };
                    var newRules = newData.Rules.concat([newRule]);
                    newData.Rules = newRules;
                    newData.Rules = _.sortBy(newData.Rules, "grade").reverse();
                    if (newData.ID == 0) {
                        newData.ID = selectedSettingID2;
                        initdata2.push(newData);
                    }
                    // re-render
                    renderSalary2(newData);
                    if (newData.Rules.length == 1) {
                        $("#tree_4").find('a.jstree-clicked i').removeClass('icon-state-default').addClass('icon-state-success');
                    }
                }
                $('input.level').val('');
                $('input.awardRate').val('');
            }, "json");
        }

        function deleteRules2(url, bt) {
            var rule_id = bt.attr("rel");
            var delete_data = {
                'ruleId': rule_id,
                'csrf_token': token
            };
            $.post(url, delete_data, function(resp) {
                if (resp.Code != '00') {
                    // alert(resp.Message);
                    bootbox.alert(resp.Message);
                } else {
                    toastr['success'](resp.Message);
                    selectedSettingID2=resp.ID;
                    var newData = data;
                    for (var idx in newData.Rules) {
                        if (newData.Rules[idx].id == rule_id) {
                            newData.Rules.splice(idx, 1);
                        }
                    }
                    if (newData.Rules.length <= 0) {
                        $("#tree_4").find('a.jstree-clicked i').removeClass('icon-state-success').addClass('icon-state-default');
                        newData.ID = 0;
                    }
                    // re-render
                    renderSalary2(newData);
                }
            }, 'json')
        }
    };
    var initDateRange = function() {

        if (!jQuery().daterangepicker) {
            return;
        }

        $('#page-date-range').daterangepicker({
                opens: (Metronic.isRTL() ? 'left' : 'right'),
                format: 'YYYY-MM-DD',
                separator: ' to ',
                //startDate: moment().subtract('days', 29),
                //endDate: moment(),
                startDate: from,
                endDate: to,
                minDate: '2012-01-01',
                maxDate: moment(),
                ranges: {
                    '今天': [moment(), moment()],
                    '昨天': [moment().subtract(1, 'days'), moment().subtract('days', 1)],
                    '最近一周': [moment().subtract(6, 'days'), moment()],
                    '最近一月': [moment().subtract(29, 'days'), moment()],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                    '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                locale: {
                    applyLabel: '确定',
                    cancelLabel: '取消',
                    fromLabel: '从',
                    toLabel: '到',
                    customRangeLabel: '选择日期范围',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    firstDay: 1
                }
            },
            function(start, end) {
                // $('#ie-list-range input').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                window.location.href = "/evaluate/index/" + start.format('YYYY-MM-DD') + '/' + end.format('YYYY-MM-DD');
            }
        );
    };
    var show_evaluate_details = function(cid) {
        $("#e-table-details").hide().show(300);
        $("#table_details tr").remove();
        var url = '/evaluate/detail/' + cid;
        $.getJSON(url, function(data) {
            $('#evaluate_comments').html(data.Comments);
            $('#cash_award').val(data.CashAward / 100);
            $('#point_award').val(data.PointAward / 100);
            var html_stars = "<span class='stars'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i></span>";
            var out = "";
            if (data.RecordList != null) {
                for (var i = 0; i < data.RecordList.length; i++) {
                    out += "<tr>";
                    out += "<td>";
                    out += data.RecordList[i].StaffName;
                    out += "</td>";
                    out += "<td>";
                    out += data.RecordList[i].StaffType;
                    out += "</td>";
                    out += "<td>";
                    out += html_stars + "<span class='star-num'>" + data.RecordList[i].Grade/100 + "</span><span>分</span>";
                    out += "</td>";
                    out += "</tr>";
                }
                $("#table_details").append(out);
                for (var i = 0; i < data.RecordList.length; i++) {
                    var num = data.RecordList[i].Grade/100;
                    $("#table_details tr").eq(i).find('.stars i:lt(' + num + ')').addClass("star_active");
                }
            }
            if (data.IsAccepted == false && data.CheckoutRecordID != 0) {
                $('#cash_award').attr('disabled', false);
                $('#point_award').attr('disabled', false).next('.btn-primary').removeClass('disabled');

                $('#save_award').unbind('click').on('click', function() {
                    var url = "/evaluate/award/save";

                    var cash_award = $('input#cash_award').val();
                    var point_award = $('input#point_award').val();

                    $(this).button("loading");
                    $.post(url, {
                        csrf_token: token,
                        cash: cash_award,
                        point: point_award,
                        id: data.ID
                    }, function(data) {
                        if (data.Code != '00') {
                            bootbox.alert(data.Message);
                        } else {
                            toastr['success'](data.Message);
                            var nRow = $('tr#' + cid, table);
                            var item_data = oTable.fnGetData(nRow);
                            item_data.EvaluateStatus = '已采纳';
                            oTable.fnUpdate(item_data, nRow);
                            $('#e-table-details').hide(250);
                        }
                        $("#save_award").button("reset");
                    }, "json");
                })
            } else {
                $('#cash_award').attr('disabled', true);
                $('#point_award').attr('disabled', true).next('.btn-primary').addClass('disabled');
            }
        });
    };
    return {
        //main function to initiate the module
        init: function() {
            toastrInit();
            pageInit();
            init_editable();
            initEvaluateTable();
            initEvaluateChart();
            initDateRange();
            initEvaluateTree();
        }
    };
}();