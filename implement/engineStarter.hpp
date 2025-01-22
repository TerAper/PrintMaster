#pragma once
#include "evantSwitch.hpp"
#include "./clients/clientsEvants.hpp"
#include "./brands/brandsEvants.hpp"
#include "./models/modelsEvants.hpp"
#include "./client_printer/client_printerEvants.hpp"
#include "./client_printer_cartridges/client_printer_cartridgesEvants.hpp"
#include "./cartridges/cartridgesEvants.hpp"
#include "./repair_parts/repair_partsEvants.hpp"
#include "./chips/chipsEvants.hpp"
#include "./printer/printerEvants.hpp"
#include "./clients_addresses/clients_addressesEvants.hpp"
#include "./clients_phone_numbers/clients_phone_numbersEvants.hpp"
#include "./orders/ordersEvants.hpp"

class EngineStarter{
public:
    static void runSession(boost::asio::ip::tcp::socket socket, ConnectionPool *connectionsPool);
    static void evantSwitchInitalaizer(EvantSwitch& evants);
};