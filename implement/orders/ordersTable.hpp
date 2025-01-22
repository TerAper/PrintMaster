#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class ordersTable{
public:
    ordersTable(sql::Connection* );
    int add_order(nlohmann::json& json);
    nlohmann::json get_orders(nlohmann::json& json);
    
private:

    sql::Connection* connection;
public:
};