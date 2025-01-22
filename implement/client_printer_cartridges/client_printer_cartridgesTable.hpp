#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class client_printer_cartridgesTable{
public:
    client_printer_cartridgesTable(sql::Connection* );
    bool add_client_printer_cartridge(nlohmann::json& json);
    nlohmann::json get_client_printer_cartridges(nlohmann::json& json);
    bool update_client_printer_cartridge(nlohmann::json& json);
    bool delete_client_printer_cartridge(nlohmann::json& json);

    
private:

    sql::Connection* connection;
public:
};