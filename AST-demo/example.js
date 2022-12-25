/**
 * SSL解密日志
 */
Ws.ns("Pro.monitor.logSsl");
Pro.monitor.logSsl.tab = function () {
  Ws.ex.tabPanelShow({
    id: "monitor_logSsl_tab",
    bindId: "monitor_log_ssl_cfg",
    onlyTab: true,
    itemPanel: [
      {
        title: lang_util.leftTree_sslproxy, //SSL解密日志
        id: "monitor_logSsl_tab_0",
        clazz: "Pro.monitor.logSsl.panel",
        files: ["web/view/monitor/log/logThreat_cfg_tpl.js", "web/view/monitor/log/interface/common.js"],
      },
    ],
  });
};
Pro.monitor.logSsl.panel = function () {
  var data_list = log_data_list.ssl
  function dispositionWin(record) {
    Ws.loadJS({
      file: ["web/view/monitor/log/interface/disposal.js"],
      success: function () {
        var inf = Ws.ex.inFile(Ws.expand.disposal);
        inf.win(record, data_list, "monitor_logSsl_maingrid");
      },
    });
  }
  function strDispose(str, reg) {
    var input = Ws.getCmt("tbar_monitor_log_Ssl_input");
    var oldStr = input.getValue();
    if (!oldStr) {
      input.setValue(str);
    } else {
      oldStr = oldStr.split(" and ");
      for (var i = 0; i < oldStr.length; i++) {
        if (oldStr[i]) {
          if (oldStr[i] == str) {
            return;
          }
        }
      }
      oldStr.push(str);
      input.setValue(oldStr.join(" and "));
    }
  }
  function formatUnit(type, val) {
    if (type == "time") {
      var a, b, c, d, e, f, t1, t2, t3, t4;
      a = parseInt(val / 86400);
      b = val % 86400;
      c = parseInt(b / 3600);
      d = b % 3600;
      e = parseInt(d / 60);
      f = d % 60;
      t1 = f + lang_log.time_s;
      t2 = e + lang_log.time_m + t1;
      t3 = c + lang_log.time_h + t2;
      t4 = a + lang_log.time_d + t3;
      if (parseInt(val / 60) < 1) {
        return t1;
      } else if (parseInt(val / 3600) < 1) {
        return t2;
      } else if (parseInt(val / 86400) < 1) {
        return t3;
      } else if (parseInt(val / 86400) >= 1) {
        return t4;
      } else {
        return val;
      }
    } else if (type == "flow") {
      if (parseInt(val / 1024) < 1) {
        return val;
      } else if (parseInt(val / 1048576) < 1) {
        return Math.round((val / 1024) * Math.pow(10, 2)) / Math.pow(10, 2) + "K";
      } else if (parseInt(val / 1073741824) < 1) {
        return Math.round((val / 1048576) * Math.pow(10, 2)) / Math.pow(10, 2) + "M";
      } else if (parseInt(val / 1099511627776) < 1) {
        return Math.round((val / 1073741824) * Math.pow(10, 2)) / Math.pow(10, 2) + "G";
      } else if (parseInt(val / 1125899906842624) < 1) {
        return Math.round((val / 1099511627776) * Math.pow(10, 2)) / Math.pow(10, 2) + "T";
      } else if (parseInt(val / 1152921504606846976) < 1) {
        return Math.round((val / 1125899906842624) * Math.pow(10, 2)) / Math.pow(10, 2) + "P";
      } else {
        return val;
      }
    }
  }
  function viewDetail(record) {
    Ws.loadJS({
      file: "web/view/monitor/log/interface/viewDetail.js",
      success: function () {
        var detailFun = new detail('ssl');
        var oneInfoTitleObj = {
          line: true,
          width: 770,
          columnWidth: 0.96,
          labelStyle: " font-size: 14px;font-weight: bold;",
        };
        var towInfoTitleObj = Ws.clone(oneInfoTitleObj, {
          width: 300,
          columnWidth: 0.5,
        });
        var oneInfoObj = {
          width: Ws.ex.langDeal({ zh_cn: 580, en: 540 }),
          columnWidth: 0.96,
        };
        Ws.create("window", {
          id: "monitor_logSsl_detailWin",
          width: 800,
          height: 500,
          autoScroll: true,
          title: lang_log.detail,
          items: [
            {
              ctype: "panel",
              width: 790,
              style: "padding:0;",
              layout: "column",
              items: [
                detailFun.detailPanel(1, "base_msg", "", oneInfoTitleObj),
                detailFun.detailPanel(2, data_list["time"]),
                detailFun.detailPanel(3, data_list["src_ip"],data_list["dst_ip"]),
                detailFun.detailPanel(4, data_list["src_port"],data_list["dst_port"] ),
                detailFun.detailPanel(5, data_list["ip_proto"],  data_list["sni"]),
                detailFun.detailPanel(5, data_list["decrypt_type"],  data_list["decrypt_rule"]),
                detailFun.detailPanel(7, data_list["tls_version_c"], data_list["tls_version_s"]),
                detailFun.detailPanel(8, data_list["server_cert_name"], data_list["server_cert_trust"]),
                detailFun.detailPanel(9, data_list["module"], data_list["issue_type"]),
                detailFun.detailPanel(10, data_list["handshake"], data_list["handshake_cause"]),
                detailFun.detailPanel(11, data_list["action"], data_list["action_cause"]),
                detailFun.detailPanel(12, data_list["cipher_c"], data_list["cipher_s"]),
                detailFun.detailPanel(13, data_list["nataddr_src"],data_list["nataddr_dst"]),
                detailFun.detailPanel(14, data_list["natport_src"],data_list["natport_dst"]),
                detailFun.detailPanel(15, data_list["server_cert_issuer"], data_list["server_cert_serial"]),
                detailFun.detailPanel(16, data_list["server_cert_validity"], data_list["sess_session_id"]),
                detailFun.detailPanel(16, data_list["session_reuse_c"], data_list["session_reuse_s"]),
                detailFun.relatedLog({
                  type: "sslproxy",
                  data: record,
                }),
              ],
            },
          ],
          bItems: [
            {
              ctype: "button",
              id: "monitor_logSsl_detailWin_toall",
              text: lang_log.toAll,
              style: "margin-left:18px;",
              handler: function () {
                if (record) {
                  var filters = [];
                  var val_arr = [];
                  if (record.time) {
                    var dates = record.time.split(/\s/);
                    var times = dates[1].split(":");
                    var startDate = dates[0] + " " + (Number(times[0]) - 1) + ":" + times[1] + ":" + times[2];
                    var endDate = dates[0] + " " + (Number(times[0]) + 1) + ":" + times[1] + ":" + times[2];
                    filters.push("(" + data_list.time + " lt '" + endDate + "')");
                    filters.push("(" + data_list.time + " gt '" + startDate + "')");
                    val_arr.push(startDate);
                    val_arr.push(endDate);
                  }
                  if (record[data_list.addr_src]) {
                    filters.push("(" + data_list.addr_src + " eq '" + record[data_list.addr_src] + "')");
                    val_arr.push(record[data_list.addr_src]);
                  }
                  if (record[data_list.addr_dst]) {
                    filters.push("(" + data_list.addr_dst + " eq '" + record[data_list.addr_dst] + "')");
                    val_arr.push(record[data_list.addr_dst]);
                  }
                  Ws.setStore(val_arr, "monitor_log_overall_regArr");
                  Ws.setStore(filters.join(" and "), "monitor_log_overall_searchBody");
                  Ws.getCmt("topMenu").click(null, "tree_monitor", null, "monitor_log_overall_cfg");
                  Ws.getCmt("monitor_logSsl_detailWin").close();
                }
              },
            },
          ],
          buttons: [
            {
              id: "monitor_logSsl_detailWin_close",
              text: lang_util.common_close,
              bindClose: true,
              handler: function () {
                Ws.getCmt("monitor_logSsl_detailWin").close();
              },
            },
          ],
          afterCreate: function () {
            if (record && Ws.isObject(record)) {
              for (var k in record) {
                if (!Ws.isString(record[k])) {
                  record[k] = String(record[k]);
                }
                var cmtObj = Ws.getCmt("ssl_log_detail_info_" + k);
                if (cmtObj) {
                  if (k == data_list["durationTime"]) {
                    record[k] = formatUnit("time", record[k]);
                  }
                  if (/bytes/.test(k)) {
                    record[k] = formatUnit("flow", record[k]);
                  }
                  cmtObj.qtip.value = Ws.stringFilter(record[k]);
                  cmtObj.setText(record[k]);
                }
              }
            }
          },
          listeners: {
            aftershow: function () {
              Ws.getCmt("monitor_log_detail_panel_grid").getPagedData();
            },
          },
        }).show();
      },
    });
  }

  var config = {
    id: "monitor_logSsl_config",
    header: lang_util.common_operation,
    type: "rowaction",
    width: Ws.ex.langDeal({ zh_cn: 50, en: 100 }),
    actions: [
      // {
      //   iconIndex: "disposition",
      //   iconCls: "icon-dispose-add",
      //   tooltip: lang_log.disposition,
      //   iconClsByValue: true,
      //   hidden :  true,
      // },
      {
        iconIndex: "view",
        iconCls: "x-toolbar-eye-img",
        tooltip: lang_util.common_view,
        // iconClsByValue: true,
      },
    ],
    callbacks: {
      "x-toolbar-eye-img": function (grid, record, action, row, col) {
        viewDetail(record.data);
      },
      // "icon-dispose-add": function (grid, record, action, row, col) {
      //   dispositionWin(record.data);
      // },
      // "x-gridcell-eyeRed-noimg": function () { },
    },
    // getData: function (value, cell, record) {
    //   if (Ws.ex.getUserPurview("manualDispose") == "write") {
    //     return {
    //       confIcon: "icon-dispose-add",
    //       confQtip: lang_log.disposition,
    //     };
    //   } else {
    //     return {
    //       confIcon: "x-gridcell-eyeRed-noimg",
    //       confQtip: "",
    //     };
    //   }
    // },
  };
  function createCM(text, key, obj) {
    var cmObj = {
      header : lang_log[text],
      width : 150,
      dataIndex : key,
      color : 'search',
      keep : false,
      hidden : false,
      encode : true,
      cellTip : true,
      cellclick : function(value) {
        if (this.color && value) {
          var str = "(" + key + " eq '" + value + "')";
          var reg = new RegExp('\\(' + key + '\\s');
          strDispose(str, reg);
        }
      }
    };
    Ws.apply(cmObj, obj, true);
    return cmObj;
  }
  data_list = log_data_list.ssl;
  var cm = [config, createCM('date', data_list['time'], {
    color: ''
  }),
    createCM('sip', data_list['src_ip']),
    createCM("dip", data_list['dst_ip']),
    createCM("sport", data_list['src_port']),
    createCM("dport", data_list['dst_port']),
    createCM("natSip", data_list['nataddr_src']),
    createCM("natDip", data_list['nataddr_dst']),
    createCM("natSport", data_list['natport_src']),
    createCM("natDport", data_list['natport_dst']),
    createCM("proto", data_list['ip_proto'], { width: 120 }),
    createCM("decrypt_rule", data_list['decrypt_rule'], { width: 120 }),
    createCM("decrypt_type", data_list['decrypt_type'], { width: 120 }),
    createCM("sni", data_list['sni'], { width: Ws.ex.langDeal({ zh_cn: 100, en: 180 }) }),
    createCM("tls_version_c", data_list['tls_version_c'], { width: Ws.ex.langDeal({ zh_cn: 70, en: 120 }) }),
    createCM("tls_version_s", data_list['tls_version_s'], { width: Ws.ex.langDeal({ zh_cn: 70, en: 120 }) }),
    createCM("cipher_c", data_list['cipher_c']),
    createCM("cipher_s", data_list['cipher_s']),
    createCM("server_cert_trust", data_list['server_cert_trust'], { width: 80 }),
    createCM("server_cert_name", data_list['server_cert_name'], { width: 80 }),
    createCM("server_cert_serial", data_list['server_cert_serial']),
    createCM("server_cert_issuer", data_list['server_cert_issuer']),
    createCM("server_cert_validity", data_list['server_cert_validity']),
    createCM("issue_type", data_list['issue_type'], { width: 80 }),
    createCM("handshake", data_list['handshake'], { width: 80 }),
    createCM("handshake_cause", data_list['handshake_cause'], { width: 80 }),
    createCM("action", data_list['action'], { width: 80 }),
    createCM("action_cause", data_list['action_cause'], { width: 80 }),
    createCM("session_reuse_c", data_list['session_reuse_c'], { width: 120 }),
    createCM("session_reuse_s", data_list['session_reuse_s'], { width: 120 }),
  ];
  //自定义---存
  function custom_save() {
    var headers_arr = Ws.getCmt("monitor_logSsl_maingrid").getColumnModel();
    var show_arr = [];
    for (var i = 1; i < headers_arr.length; i++) {
      if (!headers_arr[i].hidden && headers_arr[i].dataIndex) {
        show_arr.push(headers_arr[i].dataIndex);
      }
    }
    /* compare difference */
    if (Ws.getCmt('monitor_logSsl_maingrid').show_index_txt
        && show_arr.join('%') == Ws.getCmt('monitor_logSsl_maingrid').show_index_txt) {
      return;
    }
    var reqData = [];
    reqData.push({
      tpl: {
        head: {
          "module": "system",
          "function": "add_system_cookie_config"
        },
        body: {
          name: '',
          isObj: true,
          template: {
            "config": {
              show_columns: ""
            },
            name: ""
          }
        }
      },
      data: {
        config: {
          show_columns: show_arr,
        },
        name: "log_sslproxy",
      },
    });
    new Ws.ex.setCfg({
      reqData: reqData,
      handler: function (data) {
        if (data.head.error_code != 0) {
          Ws.MessageBox.alert(lang_util.common_confirm, data.head.error_string);
        }
      },
    }).sender();
  }

  //自定义---取
  function custom_show() {
    var funn = [
      {
        head: {
          module: "system",
          function: "get_system_cookie_config",
        },
        body: {
          name: "log_sslproxy",
        },
      },
    ];
    new Ws.ex.provider({
      params: funn,
      handler: function (response) {
        if (response) {
          if (response.head.error_code == 0) {
            if (!response.data) {
              return;
            }
            var gridId = "monitor_logSsl_maingrid";
            var allData = JSON.parse(response.data.replace(/\/\\<>&/gi, ""));
            var show_index = allData.show_columns;
            if (show_index && Ws.isArray(show_index) && !Ws.isEmpty(show_index)) {
              Ws.getCmt(gridId).show_index_txt = show_index.join("%");
              for (var k in data_list) {
                if (Ws.getCmt(gridId).getColumnObj(data_list[k]) != undefined) {
                  Ws.getCmt(gridId).setColHidden(data_list[k]);
                }
              }
              for (var i = 0; i < show_index.length; i++) {
                Ws.getCmt(gridId).setColShow(show_index[i]);
              }
            }
          } else {
            Ws.MessageBox.alert(lang_util.common_confirm, response.head.error_string);
          }
        }
      },
    }).sender();
  }

  function add_filter() {
    Ws.loadJS({
      file: ["web/view/monitor/log/interface/add_filter.js"],
      success: function () {
        var inf = Ws.ex.inFile(Ws.expand.add_filter);
        inf.win("sslproxy", "tbar_monitor_log_Ssl_input");
      },
    });
  }

  //获取开始时间和结束时间
  function format_time(type) {
    var start_time, end_time, time;
    if (type) {
      time = type;
    } else {
      time = Ws.getCmt("tbar_monitor_logSsl_filter_time").getValue();
    }
    //获取当有设备时间或pc系统时间的年月日时分秒
    function getNewTime(dateType, num) {
      var newTime = Ws.ex.getSysTime(); //获取设备时间
      if (!newTime) {
        newTime = new Date(); //获取PC时间
      }
      var YY = newTime.getFullYear(),
          MM = newTime.getMonth(),
          DD = newTime.getDate(),
          hh = newTime.getHours(),
          mm = newTime.getMinutes(),
          ss = newTime.getSeconds();

      if (dateType && num != undefined) {
        switch (dateType) {
          case "YY":
            YY -= num;
            break;
          case "MM":
            MM -= num;
            newTime.setFullYear(YY, MM, DD);
            YY = newTime.getFullYear();
            MM = newTime.getMonth();
            DD = newTime.getDate();
            break;
          case "DD":
            DD -= num;
            newTime.setFullYear(YY, MM, DD);
            YY = newTime.getFullYear();
            MM = newTime.getMonth();
            DD = newTime.getDate();
            break;
        }
      }
      MM += 1;
      MM = MM < 10 ? "0" + MM : MM;
      DD = DD < 10 ? "0" + DD : DD;
      hh = hh < 10 ? "0" + hh : hh;
      mm = mm < 10 ? "0" + mm : mm;
      ss = ss < 10 ? "0" + ss : ss;
      var ymd = YY + "-" + MM + "-" + DD,
          hms = hh + ":" + mm + ":" + ss;
      //返回年月日,时分秒
      return ymd + " " + hms;
    }

    end_time = "2100/01/01 10:59:59";
    // end_time = getNewTime();
    switch (time) {
      case "day":
        start_time = getNewTime("DD", 1);
        break;
      case "week":
        start_time = getNewTime("DD", 7);
        break;
      case "month":
        start_time = getNewTime("MM", 1);
        break;
    }
    //自定义时间
    if (time == "custom") {
      start_time = Ws.getCmt("tbar_monitor_logSsl_filter_timeStart").getValue();
      end_time = Ws.getCmt("tbar_monitor_logSsl_filter_timeEnd").getValue();
    }
    return [start_time, end_time];
  }

  //    var time_max = format_time('day')[1].replace(/\-/g, '/');
  //    time_max = time_max.split(' ')[0] + ' 23:59:59';
  var order = "descend";
  var mainGrid = {
    ctype: "grid",
    id: "monitor_logSsl_maingrid",
    autoHeight: true,
    xOverflow: true,
    autoScroll: true,
    customize: true,
    customWidth: Ws.ex.langDeal({ zh_cn: 150, en: 230 }),
    hasPage: false,
    plugins: [config],
    tbar: {
      id: "monitor_logSsl_tbar",
      items: [
        {
          ctype: "textfield",
          id: "tbar_monitor_log_Ssl_input", //搜索输入框
          allowBlank: true,
          labelWidth: 30,
          width: 120,
          maxLength: 9999,
          emptyText: lang_util.common_emptyText,
          height: 26,
          isDisplay: true,
          showSearch: true,
          reverseReg: false,
          regExpObjFlag: "any",
          searchHandler: function (obj, val, type) {
            Ws.getCmt(mainGrid.id).clearKeepOn();
            Ws.getCmt("monitor_logSsl_maingrid").getPagedData(1);
          },
          validator: function (value) {
            if (value.length >= 9999) {
              var index = value.lastIndexOf(")");
              this.setValue(value.substring(0, index + 1));
            }
            return true;
          },
        },
        {
          iconCls: "icon-cleared",
          id: "tbar_monitor_logSsl_clear", //清空搜索条件
          tooltip: lang_log.clear,
          smallIcon: true,
          handler: function () {
            var input = Ws.getCmt("tbar_monitor_log_Ssl_input");
            if (input.getValue()) {
              input.setValue("");
            }
            Ws.getCmt(mainGrid.id).clearKeepOn();
            Ws.getCmt("monitor_logSsl_maingrid").getPagedData(1);
          },
        },
        {
          iconCls: "icon-add",
          id: "tbar_monitor_logSsl_add", //添加过滤条件
          tooltip: lang_util.common_add,
          smallIcon: true,
          handler: function () {
            add_filter();
          },
        },
        {
          iconCls: "icon-save",
          id: "tbar_monitor_logSsl_save", //保存当前过滤条件
          tooltip: lang_log.save,
          smallIcon: true,
          handler: function () {
            var input = Ws.getCmt("tbar_monitor_log_Ssl_input").getValue();
            if (input == "") {
              return;
            }
            Ws.MessageBox.confirm(lang_util.common_confirm, lang_log.save_confirm, function (value) {
              if (value == "yes") {
                Ws.loadJS({
                  file: ["web/view/monitor/log/logThreat_cfg_tpl.js"],
                  success: function () {
                    var reqData = [];
                    reqData.push({
                      tpl: Pro.monitor.disposal.tpl.add_filter,
                      data: {
                        filter: input,
                      },
                    });
                    new Ws.ex.setCfg({
                      reqData: reqData,
                      handler: function (obj) {
                        //添加输出错误信息
                        if (obj.head.error_code != "0") {
                          Ws.MessageBox.alert(lang_util.common_prompt, obj.head.error_string);
                        }
                      },
                    }).sender();
                  },
                });
              }
            });
          },
        },
        {
          iconCls: "icon-copy",
          id: "tbar_monitor_logSsl_saveshow",
          tooltip: lang_log.save_show, //显示收藏夹
          smallIcon: true,
          handler: function () {
            Ws.loadJS({
              file: ["web/view/monitor/log/interface/show_save.js"],
              success: function () {
                var inf = Ws.ex.inFile(Ws.expand.show_save);
                inf.win("logTraffic", "tbar_monitor_log_Ssl_input");
              },
            });
          },
        },
        {
          iconCls: "icon-export",
          id: "tbar_monitor_logSsl_export",
          tooltip: lang_util.common_export, //导出
          smallIcon: true,
          handler: function () {
            Ws.getCmt("tbar_monitor_logSsl_export").disable();
            Ws.MessageBox.progress();

            var filter = Ws.getCmt("tbar_monitor_log_Ssl_input").getValue(),
                time_arr = format_time(),
                time_start = time_arr[0],
                time_end = time_arr[1],
                log_show = {};

            if (time_start && time_end) {
              var _time_start = time_start.replace(/\-/g, "/");
              var _time_end = time_end.replace(/\-/g, "/");
              var time_start_num = new Date(_time_start).getTime();
              var time_end_num = new Date(_time_end).getTime();
              time_start = time_start.replace(/\//g, "-");
              time_end = time_end.replace(/\//g, "-");
            }
            if (time_end_num < time_start_num) {
              Ws.MessageBox.alert(lang_util.common_prompt, lang_log.alert_time);
              return;
            }

            log_show = {
              filter: filter,
              time_start: time_start,
              time_end: time_end,
              order: order,
            };

            var funObj = {
              head: {
                function: "export_log_sslproxy",
                module: "stored",
                page_index: 1,
                page_size: 10000,
              },
              body: {
                log_show: log_show,
              },
            };
            new Ws.ex.provider({
              params: [funObj],
              handler: function (obj) {
                Ws.getCmt("tbar_monitor_logSsl_export").enable();
                if (obj.head["error_code"] == "0") {
                  Ws.ex.downloader(obj.data.filter);
                  Ws.MessageBox.hide();
                } else {
                  Ws.MessageBox.hide();
                  Ws.MessageBox.alert(lang_util.common_prompt, obj.head["error_string"], function () {
                    if (obj.data && obj.data.filter) {
                      Ws.ex.downloader(obj.data.filter);
                    }
                  });
                }
              },
            }).sender();
          },
        },
        {
          iconCls: "icon-sequence",
          id: "tbar_monitor_logSsl_reordering",
          tooltip: lang_log.reordering,
          smallIcon: true,
          handler: function (obj) {
            if (order == "ascend") {
              order = "descend";
            } else {
              order = "ascend";
            }
            Ws.getCmt("monitor_logSsl_maingrid").getPagedData(1, "", false, false);
          },
        },
        {
          ctype: "datefield",
          id: "tbar_monitor_logSsl_filter_timeStart",
          fieldLabel: lang_log.time_start, //开始时间
          labelWidth: Ws.ex.langDeal({ zh_cn: 30, en: 40 }),
          width: 120,
          allowBlank: true,
          hidden: true,
          // max : time_max,
          listeners: {
            setValue: function (item) {
              if (item.getValue() && Ws.getCmt("tbar_monitor_logSsl_filter_timeEnd").getValue()) {
                Ws.getCmt(mainGrid.id).clearKeepOn();
                Ws.getCmt("monitor_logSsl_maingrid").getPagedData(1);
              }
            },
          },
        },
        {
          ctype: "datefield",
          id: "tbar_monitor_logSsl_filter_timeEnd",
          fieldLabel: lang_log.time_end, //结束时间
          labelWidth: Ws.ex.langDeal({ zh_cn: 30, en: 40 }),
          width: 120,
          allowBlank: true,
          hidden: true,
          // max : time_max,
          listeners: {
            setValue: function (item) {
              if (item.getValue() && Ws.getCmt("tbar_monitor_logSsl_filter_timeStart").getValue()) {
                Ws.getCmt(mainGrid.id).clearKeepOn();
                Ws.getCmt("monitor_logSsl_maingrid").getPagedData(1);
              }
            },
          },
        },
        {
          ctype: "combox",
          id: "tbar_monitor_logSsl_filter_time",
          value: "day",
          store: [['day', lang_log.time_day], ['week', lang_log.time_week], ['month', lang_log.time_month], ['custom', lang_log.time_custom]],
          width: Ws.ex.langDeal({ zh_cn: 50, en: 75 }),
          allowBlank: true,
          listeners: {
            select: function (item, dataArr, index) {
              if (item.getValue() == "custom") {
                Ws.getCmt("tbar_monitor_log_Ssl_input").setWidth(Ws.getCmt("monitor_logSsl_tbar"), Ws.ex.langDeal({ zh_cn: 680, en: 725 }));
                Ws.getCmt("tbar_monitor_logSsl_filter_timeStart").show();
                Ws.getCmt("tbar_monitor_logSsl_filter_timeEnd").show();
              } else {
                Ws.getCmt("tbar_monitor_log_Ssl_input").setWidth(Ws.getCmt("monitor_logSsl_tbar"), Ws.ex.langDeal({ zh_cn: 310, en: 335 }));
                Ws.getCmt("tbar_monitor_logSsl_filter_timeStart").hide();
                Ws.getCmt("tbar_monitor_logSsl_filter_timeEnd").hide();
                Ws.getCmt(mainGrid.id).clearKeepOn();
                Ws.getCmt("monitor_logSsl_maingrid").getPagedData(1);
              }
            },
          },
        },
      ],
    },
    store: {
      root: "data",
      totaleProperty: "totalCount",
      fields: [],
    },
    cm: cm,
    getPagedData: function (pageIndex, filter, stop, isKeepSearch) {
      var thatGrid = this;
      if (stop) {
        return;
      }
      var reg,
          val_arr,
          match_val,
          time_start,
          time_end;
      var globalStore = Ws.getStore("monitor_log_searchBody");
      var time_arr = format_time();
      time_start = time_arr[0]; //开始时间
      time_end = time_arr[1]; //结束时间
      //从其他模块跳转到日志模块并带filter
      if (globalStore) {
        reg = /^\((time)[ ](eq|lt|gt)[ ]'(.*)'\)$/;
        val_arr = globalStore.split(" and ");
        for (var i = 0; i < val_arr.length; i++) {
          //                    match_val = '';
          if (val_arr[i]) {
            match_val = val_arr[i].match(reg, "gi");
            if (match_val != null) {
              if (match_val[2] == "eq") {
                time_start = match_val[3];
                time_end = match_val[3];
              }
              if (match_val[2] == "lt" || match_val[2] == "lte") {
                time_end = match_val[3];
              }
              if (match_val[2] == "gt" || match_val[2] == "gte") {
                time_start = match_val[3];
              }
              val_arr.remove(i);
              i--;
            }
          }
        }
        if (time_start && time_end) {
          Ws.getCmt("tbar_monitor_logSsl_filter_time").setValue("custom");
          Ws.getCmt("tbar_monitor_log_Ssl_input").setWidth(Ws.getCmt("monitor_logSsl_tbar"), Ws.ex.langDeal({ zh_cn: 680, en: 725 }));
          Ws.getCmt("tbar_monitor_logSsl_filter_timeStart").show();
          Ws.getCmt("tbar_monitor_logSsl_filter_timeEnd").show();
          time_start = time_start.replace(/\-/g, "/");
          time_end = time_end.replace(/\-/g, "/");
          Ws.getCmt("tbar_monitor_logSsl_filter_timeStart").setValue(time_start);
          Ws.getCmt("tbar_monitor_logSsl_filter_timeEnd").setValue(time_end);
        }
        Ws.getCmt("tbar_monitor_log_Ssl_input").setValue(val_arr.join(" and "));
        Ws.clearStore("monitor_log_searchBody");
      }
      //没有filter则使用当前搜索框
      if (typeof filter == "undefined") {
        filter = Ws.getCmt("tbar_monitor_log_Ssl_input").getValue();
      }
      //开始时间和结束时间进行转格式
      if (time_start && time_end) {
        var _time_start = time_start.replace(/\-/g, "/");
        var _time_end = time_end.replace(/\-/g, "/");
        var time_start_num = new Date(_time_start).getTime();
        var time_end_num = new Date(_time_end).getTime();
        time_start = time_start.replace(/\//g, "-");
        time_end = time_end.replace(/\//g, "-");
      }
      if (time_end_num < time_start_num) {
        Ws.MessageBox.alert(lang_util.common_prompt, lang_log.alert_time);
        return;
      }
      //使用继续查询时,下发因超时被中断的时间点.
      if (isKeepSearch && Ws.getCmt(thatGrid.id).keepOn.time_stop) {
        var time_stop = Ws.getCmt(thatGrid.id).keepOn.time_stop;
        if (order == "ascend" && time_stop < time_end) {
          time_start = time_stop;
        } else if (time_stop > time_start) {
          time_end = time_stop;
        }
      }
      if (Ws.getCmt(thatGrid.id).keepOn.filter) {
        filter = Ws.getCmt(thatGrid.id).keepOn.filter;
      }
      var funObj = {
        head: {
          module: "stored",
          function: "get_log_sslproxy",
          page_index: Number(pageIndex),
          page_size: this.pageSize,
        },
        body: {
          log_show: {
            filter: filter,
            time_start: time_start,
            time_end: time_end,
            order: order,
          },
        },
      };
      new Ws.ex.provider({
        params: [funObj],
        timeout: 90000,
        maskID: "monitor_logSsl_maingrid",
        handler: function (obj) {
          if (Ws.expand.logCommon.gridHandler) {
            Ws.expand.logCommon.gridHandler(thatGrid.id, obj, funObj.body);
          }
        }
      }).sender();
    },
    listeners: {
      destroy: function () {
        custom_save();
      },
    },
    afterCreate: function () {
      custom_show();
      Ws.getCmt("tbar_monitor_log_Ssl_input").setWidth(Ws.getCmt("monitor_logSsl_tbar"), Ws.ex.langDeal({ zh_cn: 310, en: 335 }), Ws.getCmt('monitor_logSsl_maingrid'));
    },
    keepOn: {
      time_stop: "", //查询超时时中断的时间点
      filter: "",
    },
    keepOnSearch: function () {
      //搜索超时后,继续查询
      var filter = this.keepOn.filter;
      if (filter == "") {
        Ws.getCmt("tbar_monitor_log_Ssl_input").reset();
      } else {
        Ws.getCmt("tbar_monitor_log_Ssl_input").setValue(filter);
      }
      this.getPagedData(1, filter, null, true);
    },
    clearKeepOn: function() {
      this.keepOn = {
        time_stop: "",//查询超时时中断的时间点
        filter: ""
      }
    }
  };
  Ws.ex.panelShow({
        id: "logSsl_main_panel",
        autoWidth: true,
        autoHeight: true,
        layout: "form",
        items: [mainGrid],
        afterCreate: function () {
          Ws.getCmt("monitor_logSsl_maingrid").getPagedData(1);
        },
      },{
        id: "monitor_logSsl_tab",
        index: 0,
      }
  );


};
