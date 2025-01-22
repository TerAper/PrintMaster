cmake_minimum_required(VERSION 3.10)

project(MyProject)

set(SOURCES
    ./implement/dataBase.cpp
    ./implement/printer/printerTable.cpp
    ./implement/clients/clientsTable.cpp
    ./implement/brands/brandsTable.cpp
    ./implement/models/modelsTable.cpp
    ./implement/cartridges/cartridgesTable.cpp
    ./implement/chips/chipsTable.cpp
    ./implement/client_printer/client_printerTable.cpp
    ./implement/client_printer_cartridges/client_printer_cartridgesTable.cpp
    ./implement/clients_phone_numbers/clients_phone_numbersTable.cpp
    ./implement/clients_addresses/clients_addressesTable.cpp
    ./implement/orders/ordersTable.cpp
    ./implement/repair_parts/repair_partsTable.cpp



    ./implement/printer/printerEvants.cpp
    ./implement/clients/clientsEvants.cpp
    ./implement/brands/brandsEvants.cpp
    ./implement/models/modelsEvants.cpp
    ./implement/client_printer/client_printerEvants.cpp
    ./implement/client_printer_cartridges/client_printer_cartridgesEvants.cpp
    ./implement/cartridges/cartridgesEvants.cpp
    ./implement/chips/chipsEvants.cpp
    ./implement/clients_addresses/clients_addressesEvants.cpp
    ./implement/clients_phone_numbers/clients_phone_numbersEvants.cpp
    ./implement/orders/ordersEvants.cpp
    ./implement/repair_parts/repair_partsEvants.cpp
    

    ./implement/evantSwitch.cpp
    ./implement/helperFunctions.cpp
    ./implement/main.cpp
    ./implement/engineStarter.cpp
    
)

add_executable(MyExecutable ${SOURCES})

target_link_libraries(MyExecutable mysqlcppconn)
