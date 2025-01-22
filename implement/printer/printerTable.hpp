#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>

class printerTable{
public:
    printerTable(sql::Connection* );
public:
    int addPrinter(nlohmann::json json);
    
    nlohmann::json getPrinters(nlohmann::json json);
private:
    sql::Connection* connection;
public:
};