#pragma once
#include "printer/printerTable.hpp"
#include "clients/clientsTable.hpp"
#include "brands/brandsTable.hpp"
#include "models/modelsTable.hpp"
#include "client_printer/client_printerTable.hpp"
#include "client_printer_cartridges/client_printer_cartridgesTable.hpp"
#include "cartridges/cartridgesTable.hpp"
#include "chips/chipsTable.hpp"
#include "orders/ordersTable.hpp"
#include "repair_parts/repair_partsTable.hpp"
#include "clients_addresses/clients_addressesTable.hpp"
#include "clients_phone_numbers/clients_phone_numbersTable.hpp"

#include <cppconn/connection.h>
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
#include <fstream>
#include <utility>
#include <mutex>
#include <vector>

#include <boost/beast.hpp>
class DataBase:
              public printerTable
              ,public clientsTable  
              ,public brandsTable  
              ,public modelsTable
              ,public client_printersTable
              ,public client_printer_cartridgesTable
              ,public cartridgesTable  
              ,public chipsTable
              ,public client_addressesTable  
              ,public client_phone_numbersTable
              ,public repair_partsTable
              ,public ordersTable
                
                {
public:
    DataBase(sql::Connection* );
   
private:
    sql::Connection* connection;
public:
};


struct PoolParams{
    std::string dataBaseHost;
    std::string dataBasePort;
    std::string dataBaseName; 
    std::string dataBasePassword;
    std::string dataBaseLogin;
    int poolSize;
};

using poolFild = std::pair<long,sql::Connection*>;

class ConnectionPool{
public:
    ConnectionPool(PoolParams params);
    sql::Connection* getConnection(long thredId);
    void returnConnection(long thredId);

public:
    std::vector<poolFild> connections;
    std::mutex mutex;
};
