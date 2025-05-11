export const Azure_Resources = [
    {
        "type": "azurerm_virtual_machine",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "network_interface_ids": { "type": "list", "required": true, "options": [] },
            "vm_size": {
                "type": "string",
                "required": true,
                "options": [
                    "Basic_A0", "Basic_A1", "Basic_A2", "Basic_A3", "Basic_A4",
                    "Standard_A0", "Standard_A1", "Standard_A2", "Standard_A3", "Standard_A4",
                    "Standard_A5", "Standard_A6", "Standard_A7", "Standard_A8", "Standard_A9", "Standard_A10", "Standard_A11",
                    "Standard_D1", "Standard_D2", "Standard_D3", "Standard_D4", "Standard_D11", "Standard_D12", "Standard_D13", "Standard_D14",
                    "Standard_D1_v2", "Standard_D2_v2", "Standard_D3_v2", "Standard_D4_v2", "Standard_D5_v2",
                    "Standard_D11_v2", "Standard_D12_v2", "Standard_D13_v2", "Standard_D14_v2", "Standard_D15_v2",
                    "Standard_F1", "Standard_F2", "Standard_F4", "Standard_F8", "Standard_F16",
                    "Standard_DS1", "Standard_DS2", "Standard_DS3", "Standard_DS4", "Standard_DS11", "Standard_DS12", "Standard_DS13", "Standard_DS14",
                    "Standard_DS1_v2", "Standard_DS2_v2", "Standard_DS3_v2", "Standard_DS4_v2", "Standard_DS5_v2",
                    "Standard_DS11_v2", "Standard_DS12_v2", "Standard_DS13_v2", "Standard_DS14_v2", "Standard_DS15_v2"
                ]
            },
            "storage_image_reference": {
                "type": "map",
                "required": false,
                "properties": {
                    "publisher": { "type": "string", "required": false },
                    "offer": { "type": "string", "required": false },
                    "sku": { "type": "string", "required": false },
                    "version": { "type": "string", "required": false }
                }
            },
            "storage_os_disk": {
                "type": "map",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "caching": {
                        "type": "string",
                        "required": false,
                        "options": ["None", "ReadOnly", "ReadWrite"]
                    },
                    "create_option": {
                        "type": "string",
                        "required": true,
                        "options": ["FromImage", "Empty", "Attach"]
                    },
                    "disk_size_gb": { "type": "number", "required": false },
                    "managed_disk_type": {
                        "type": "string",
                        "required": false,
                        "options": ["Standard_LRS", "Premium_LRS", "StandardSSD_LRS", "UltraSSD_LRS"]
                    }
                }
            },
            "os_profile": {
                "type": "map",
                "required": false,
                "properties": {
                    "computer_name": { "type": "string", "required": true },
                    "admin_username": { "type": "string", "required": true },
                    "admin_password": { "type": "string", "required": false }
                }
            },
            "os_profile_linux_config": {
                "type": "map",
                "required": false,
                "properties": {
                    "disable_password_authentication": { "type": "bool", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_storage_account",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "account_tier": {
                "type": "string",
                "required": true,
                "options": ["Standard", "Premium"]
            },
            "account_replication_type": {
                "type": "string",
                "required": true,
                "options": ["LRS", "GRS", "RAGRS", "ZRS", "GZRS", "RAGZRS"]
            },
            "account_kind": {
                "type": "string",
                "required": false,
                "options": ["Storage", "StorageV2", "BlobStorage", "FileStorage", "BlockBlobStorage"]
            },
            "access_tier": {
                "type": "string",
                "required": false,
                "options": ["Hot", "Cool"]
            },
            "enable_https_traffic_only": { "type": "bool", "required": false, "options": [] },
            "min_tls_version": {
                "type": "string",
                "required": false,
                "options": ["TLS1_0", "TLS1_1", "TLS1_2"]
            },
            "allow_blob_public_access": { "type": "bool", "required": false, "options": [] },
            "network_rules": {
                "type": "map",
                "required": false,
                "properties": {
                    "default_action": {
                        "type": "string",
                        "required": true,
                        "options": ["Allow", "Deny"]
                    },
                    "ip_rules": { "type": "list", "required": false },
                    "virtual_network_subnet_ids": { "type": "list", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_app_service_plan",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "kind": {
                "type": "string",
                "required": false,
                "options": ["Windows", "Linux", "FunctionApp"]
            },
            "sku": {
                "type": "map",
                "required": true,
                "properties": {
                    "tier": {
                        "type": "string",
                        "required": true,
                        "options": ["Free", "Shared", "Basic", "Standard", "Premium", "PremiumV2", "PremiumV3", "Isolated"]
                    },
                    "size": {
                        "type": "string",
                        "required": true,
                        "options": ["F1", "D1", "B1", "B2", "B3", "S1", "S2", "S3", "P1", "P2", "P3", "P1V2", "P2V2", "P3V2", "I1", "I2", "I3"]
                    },
                    "capacity": { "type": "number", "required": false }
                }
            },
            "reserved": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_app_service",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "app_service_plan_id": { "type": "string", "required": true, "options": [] },
            "app_settings": { "type": "map", "required": false, "options": [] },
            "client_affinity_enabled": { "type": "bool", "required": false, "options": [] },
            "enabled": { "type": "bool", "required": false, "options": [] },
            "https_only": { "type": "bool", "required": false, "options": [] },
            "identity": {
                "type": "map",
                "required": false,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["SystemAssigned", "UserAssigned", "SystemAssigned, UserAssigned"]
                    }
                }
            },
            "site_config": {
                "type": "map",
                "required": false,
                "properties": {
                    "always_on": { "type": "bool", "required": false },
                    "linux_fx_version": { "type": "string", "required": false },
                    "windows_fx_version": { "type": "string", "required": false },
                    "http2_enabled": { "type": "bool", "required": false }
                }
            },
            "connection_string": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["APIHub", "Custom", "DocDb", "EventHub", "MySQL", "NotificationHub", "PostgreSQL", "RedisCache", "ServiceBus", "SQLAzure", "SQLServer"]
                    },
                    "value": { "type": "string", "required": true }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_function_app",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "app_service_plan_id": { "type": "string", "required": true, "options": [] },
            "storage_account_name": { "type": "string", "required": true, "options": [] },
            "storage_account_access_key": { "type": "string", "required": true, "options": [] },
            "version": {
                "type": "string",
                "required": false,
                "options": ["~1", "~2", "~3"]
            },
            "app_settings": { "type": "map", "required": false, "options": [] },
            "enable_builtin_logging": { "type": "bool", "required": false, "options": [] },
            "https_only": { "type": "bool", "required": false, "options": [] },
            "identity": {
                "type": "map",
                "required": false,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["SystemAssigned", "UserAssigned", "SystemAssigned, UserAssigned"]
                    }
                }
            },
            "site_config": {
                "type": "map",
                "required": false,
                "properties": {
                    "always_on": { "type": "bool", "required": false },
                    "use_32_bit_worker_process": { "type": "bool", "required": false },
                    "websockets_enabled": { "type": "bool", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_virtual_network",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "address_space": { "type": "list", "required": true, "options": [] },
            "dns_servers": { "type": "list", "required": false, "options": [] },
            "subnet": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "address_prefix": { "type": "string", "required": true }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_subnet",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "virtual_network_name": { "type": "string", "required": true, "options": [] },
            "address_prefixes": { "type": "list", "required": true, "options": [] },
            "service_endpoints": { "type": "list", "required": false, "options": [] },
            "enforce_private_link_endpoint_network_policies": { "type": "bool", "required": false, "options": [] },
            "delegation": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "service_delegation": {
                        "type": "map",
                        "properties": {
                            "name": {
                                "type": "string",
                                "required": true,
                                "options": [
                                    "Microsoft.ApiManagement/service", "Microsoft.AzureCosmosDB/clusters",
                                    "Microsoft.BareMetal/AzureVMware", "Microsoft.BareMetal/CrayServers",
                                    "Microsoft.Batch/batchAccounts", "Microsoft.ContainerInstance/containerGroups",
                                    "Microsoft.Databricks/workspaces", "Microsoft.DBforMySQL/servers",
                                    "Microsoft.DBforPostgreSQL/servers", "Microsoft.HardwareSecurityModules/dedicatedHSMs",
                                    "Microsoft.Kusto/clusters", "Microsoft.Logic/integrationServiceEnvironments",
                                    "Microsoft.Netapp/volumes", "Microsoft.ServiceFabricMesh/networks",
                                    "Microsoft.Sql/managedInstances", "Microsoft.Sql/servers",
                                    "Microsoft.StreamAnalytics/streamingJobs", "Microsoft.Web/hostingEnvironments",
                                    "Microsoft.Web/serverFarms"
                                ]
                            },
                            "actions": { "type": "list", "required": false }
                        }
                    }
                }
            }
        }
    },
    {
        "type": "azurerm_network_security_group",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "security_rule": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "priority": { "type": "number", "required": true },
                    "direction": {
                        "type": "string",
                        "required": true,
                        "options": ["Inbound", "Outbound"]
                    },
                    "access": {
                        "type": "string",
                        "required": true,
                        "options": ["Allow", "Deny"]
                    },
                    "protocol": {
                        "type": "string",
                        "required": true,
                        "options": ["Tcp", "Udp", "Icmp", "Esp", "*"]
                    },
                    "source_port_range": { "type": "string", "required": false },
                    "destination_port_range": { "type": "string", "required": false },
                    "source_address_prefix": { "type": "string", "required": false },
                    "destination_address_prefix": { "type": "string", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_public_ip",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "allocation_method": {
                "type": "string",
                "required": true,
                "options": ["Static", "Dynamic"]
            },
            "sku": {
                "type": "string",
                "required": false,
                "options": ["Basic", "Standard"]
            },
            "ip_version": {
                "type": "string",
                "required": false,
                "options": ["IPv4", "IPv6"]
            },
            "domain_name_label": { "type": "string", "required": false, "options": [] },
            "idle_timeout_in_minutes": { "type": "number", "required": false, "options": [] },
            "zones": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_sql_server",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "version": {
                "type": "string",
                "required": true,
                "options": ["2.0", "12.0"]
            },
            "administrator_login": { "type": "string", "required": true, "options": [] },
            "administrator_login_password": { "type": "string", "required": true, "options": [] },
            "identity": {
                "type": "map",
                "required": false,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["SystemAssigned"]
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_sql_database",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "server_name": { "type": "string", "required": true, "options": [] },
            "create_mode": {
                "type": "string",
                "required": false,
                "options": [
                    "Default", "Copy", "Secondary", "PointInTimeRestore",
                    "Restore", "Recovery", "RestoreLongTermRetentionBackup"
                ]
            },
            "edition": {
                "type": "string",
                "required": false,
                "options": [
                    "Basic", "Standard", "Premium", "DataWarehouse", "Free",
                    "Stretch", "GeneralPurpose", "BusinessCritical", "Hyperscale"
                ]
            },
            "collation": { "type": "string", "required": false, "options": [] },
            "max_size_bytes": { "type": "number", "required": false, "options": [] },
            "requested_service_objective_name": {
                "type": "string",
                "required": false,
                "options": [
                    "Basic", "S0", "S1", "S2", "S3", "S4", "S6", "S7", "S9", "S12",
                    "P1", "P2", "P4", "P6", "P11", "P15",
                    "DW100", "DW200", "DW300", "DW400", "DW500", "DW600", "DW1000", "DW1200", "DW1000c", "DW1500", "DW1500c", "DW2000", "DW2000c", "DW3000", "DW2500c", "DW3000c", "DW6000", "DW5000c", "DW6000c", "DW7500c", "DW10000c", "DW15000c", "DW30000c"
                ]
            },
            "elastic_pool_name": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_cosmosdb_account",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "offer_type": {
                "type": "string",
                "required": true,
                "options": ["Standard"]
            },
            "kind": {
                "type": "string",
                "required": false,
                "options": ["GlobalDocumentDB", "MongoDB", "Parse"]
            },
            "consistency_policy": {
                "type": "map",
                "required": true,
                "properties": {
                    "consistency_level": {
                        "type": "string",
                        "required": true,
                        "options": ["Eventual", "Session", "BoundedStaleness", "Strong"]
                    },
                    "max_interval_in_seconds": { "type": "number", "required": false },
                    "max_staleness_prefix": { "type": "number", "required": false }
                }
            },
            "geo_location": {
                "type": "list",
                "required": true,
                "properties": {
                    "location": { "type": "string", "required": true },
                    "failover_priority": { "type": "number", "required": true }
                }
            },
            "capabilities": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": {
                        "type": "string",
                        "required": true,
                        "options": [
                            "EnableAggregationPipeline", "EnableCassandra", "EnableGremlin",
                            "EnableTable", "EnableServerless", "EnableMongo"
                        ]
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_kubernetes_cluster",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "dns_prefix": { "type": "string", "required": true, "options": [] },
            "default_node_pool": {
                "type": "map",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "node_count": { "type": "number", "required": true },
                    "vm_size": {
                        "type": "string",
                        "required": true,
                        "options": [
                            "Standard_A2", "Standard_A4", "Standard_D2_v2", "Standard_D4_v2", "Standard_D8_v2", "Standard_D16_v2",
                            "Standard_DS2_v2", "Standard_DS4_v2", "Standard_DS8_v2", "Standard_DS16_v2",
                            "Standard_F2s", "Standard_F4s", "Standard_F8s", "Standard_F16s"
                        ]
                    }
                }
            },
            "identity": {
                "type": "map",
                "required": true,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["SystemAssigned", "UserAssigned"]
                    }
                }
            },
            "network_profile": {
                "type": "map",
                "required": false,
                "properties": {
                    "network_plugin": {
                        "type": "string",
                        "required": true,
                        "options": ["azure", "kubenet"]
                    },
                    "service_cidr": { "type": "string", "required": false },
                    "dns_service_ip": { "type": "string", "required": false }
                }
            },
            "role_based_access_control": {
                "type": "map",
                "required": false,
                "properties": {
                    "enabled": { "type": "bool", "required": true }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_container_registry",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "sku": {
                "type": "string",
                "required": true,
                "options": ["Basic", "Standard", "Premium"]
            },
            "admin_enabled": { "type": "bool", "required": false, "options": [] },
            "georeplication_locations": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_servicebus_namespace",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "sku": {
                "type": "string",
                "required": true,
                "options": ["Basic", "Standard", "Premium"]
            },
            "capacity": { "type": "number", "required": false, "options": [] },
            "zone_redundant": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_servicebus_queue",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "namespace_name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "enable_partitioning": { "type": "bool", "required": false, "options": [] },
            "max_size_in_megabytes": { "type": "number", "required": false, "options": [] },
            "requires_duplicate_detection": { "type": "bool", "required": false, "options": [] },
            "dead_lettering_on_message_expiration": { "type": "bool", "required": false, "options": [] },
            "default_message_ttl": { "type": "string", "required": false, "options": [] },
            "lock_duration": { "type": "string", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_eventhub_namespace",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "sku": {
                "type": "string",
                "required": true,
                "options": ["Basic", "Standard"]
            },
            "capacity": { "type": "number", "required": false, "options": [] },
            "auto_inflate_enabled": { "type": "bool", "required": false, "options": [] },
            "maximum_throughput_units": { "type": "number", "required": false, "options": [] },
            "zone_redundant": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_eventhub",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "namespace_name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "partition_count": { "type": "number", "required": true, "options": [] },
            "message_retention": { "type": "number", "required": true, "options": [] },
            "capture_description": {
                "type": "map",
                "required": false,
                "properties": {
                    "enabled": { "type": "bool", "required": true },
                    "encoding": {
                        "type": "string",
                        "required": true,
                        "options": ["Avro", "AvroDeflate"]
                    },
                    "interval_in_seconds": { "type": "number", "required": false },
                    "size_limit_in_bytes": { "type": "number", "required": false },
                    "destination": {
                        "type": "map",
                        "required": true,
                        "properties": {
                            "name": { "type": "string", "required": true },
                            "storage_account_id": { "type": "string", "required": true },
                            "blob_container_name": { "type": "string", "required": true }
                        }
                    }
                }
            }
        }
    },
    {
        "type": "azurerm_redis_cache",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "capacity": { "type": "number", "required": true, "options": [] },
            "family": {
                "type": "string",
                "required": true,
                "options": ["C", "P"]
            },
            "sku_name": {
                "type": "string",
                "required": true,
                "options": ["Basic", "Standard", "Premium"]
            },
            "enable_non_ssl_port": { "type": "bool", "required": false, "options": [] },
            "minimum_tls_version": {
                "type": "string",
                "required": false,
                "options": ["1.0", "1.1", "1.2"]
            },
            "patch_schedule": {
                "type": "list",
                "required": false,
                "properties": {
                    "day_of_week": {
                        "type": "string",
                        "required": true,
                        "options": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                    },
                    "start_hour_utc": { "type": "number", "required": false }
                }
            },
            "redis_configuration": {
                "type": "map",
                "required": false,
                "properties": {
                    "maxmemory_reserved": { "type": "number", "required": false },
                    "maxmemory_delta": { "type": "number", "required": false },
                    "maxmemory_policy": {
                        "type": "string",
                        "required": false,
                        "options": ["volatile-lru", "allkeys-lru", "volatile-random", "allkeys-random", "volatile-ttl", "noeviction"]
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_key_vault",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "sku_name": {
                "type": "string",
                "required": true,
                "options": ["standard", "premium"]
            },
            "tenant_id": { "type": "string", "required": true, "options": [] },
            "access_policy": {
                "type": "list",
                "required": false,
                "properties": {
                    "tenant_id": { "type": "string", "required": true },
                    "object_id": { "type": "string", "required": true },
                    "key_permissions": {
                        "type": "list",
                        "required": false,
                        "options": [
                            "backup", "create", "decrypt", "delete", "encrypt",
                            "get", "import", "list", "purge", "recover",
                            "restore", "sign", "unwrapKey", "update", "verify", "wrapKey"
                        ]
                    },
                    "secret_permissions": {
                        "type": "list",
                        "required": false,
                        "options": [
                            "backup", "delete", "get", "list", "purge",
                            "recover", "restore", "set"
                        ]
                    },
                    "certificate_permissions": {
                        "type": "list",
                        "required": false,
                        "options": [
                            "create", "delete", "deleteissuers", "get", "getissuers",
                            "import", "list", "listissuers", "managecontacts", "manageissuers",
                            "purge", "recover", "setissuers", "update"
                        ]
                    }
                }
            },
            "enabled_for_deployment": { "type": "bool", "required": false, "options": [] },
            "enabled_for_disk_encryption": { "type": "bool", "required": false, "options": [] },
            "enabled_for_template_deployment": { "type": "bool", "required": false, "options": [] },
            "network_acls": {
                "type": "map",
                "required": false,
                "properties": {
                    "default_action": {
                        "type": "string",
                        "required": true,
                        "options": ["Allow", "Deny"]
                    },
                    "bypass": {
                        "type": "string",
                        "required": true,
                        "options": ["None", "AzureServices"]
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_monitor_action_group",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "short_name": { "type": "string", "required": true, "options": [] },
            "email_receiver": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "email_address": { "type": "string", "required": true }
                }
            },
            "sms_receiver": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "country_code": { "type": "string", "required": true },
                    "phone_number": { "type": "string", "required": true }
                }
            },
            "webhook_receiver": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "service_uri": { "type": "string", "required": true }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_data_factory",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "identity": {
                "type": "map",
                "required": false,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["SystemAssigned"]
                    }
                }
            },
            "github_configuration": {
                "type": "map",
                "required": false,
                "properties": {
                    "account_name": { "type": "string", "required": true },
                    "branch_name": { "type": "string", "required": true },
                    "git_url": { "type": "string", "required": true },
                    "repository_name": { "type": "string", "required": true },
                    "root_folder": { "type": "string", "required": true }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_storage_container",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "storage_account_name": { "type": "string", "required": true, "options": [] },
            "container_access_type": {
                "type": "string",
                "required": false,
                "options": ["private", "blob", "container"]
            }
        }
    },
    {
        "type": "azurerm_cdn_profile",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "sku": {
                "type": "string",
                "required": true,
                "options": ["Standard_Verizon", "Premium_Verizon", "Custom_Verizon", "Standard_Akamai", "Standard_ChinaCdn", "Standard_Microsoft"]
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_cdn_endpoint",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "profile_name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "origin": {
                "type": "list",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "host_name": { "type": "string", "required": true }
                }
            },
            "optimization_type": {
                "type": "string",
                "required": false,
                "options": [
                    "GeneralWebDelivery", "GeneralMediaStreaming", "VideoOnDemandMediaStreaming",
                    "LargeFileDownload", "DynamicSiteAcceleration"
                ]
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_mysql_server",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "administrator_login": { "type": "string", "required": true, "options": [] },
            "administrator_login_password": { "type": "string", "required": true, "options": [] },
            "sku_name": { "type": "string", "required": true, "options": [] },
            "storage_mb": { "type": "number", "required": true, "options": [] },
            "version": {
                "type": "string",
                "required": true,
                "options": ["5.6", "5.7", "8.0"]
            },
            "ssl_enforcement_enabled": { "type": "bool", "required": true, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_postgresql_server",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "administrator_login": { "type": "string", "required": true, "options": [] },
            "administrator_login_password": { "type": "string", "required": true, "options": [] },
            "sku_name": { "type": "string", "required": true, "options": [] },
            "version": {
                "type": "string",
                "required": true,
                "options": ["9.5", "9.6", "10", "11"]
            },
            "storage_mb": { "type": "number", "required": true, "options": [] },
            "ssl_enforcement_enabled": { "type": "bool", "required": true, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_databricks_workspace",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "sku": {
                "type": "string",
                "required": true,
                "options": ["standard", "premium"]
            },
            "managed_resource_group_name": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_synapse_workspace",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "storage_data_lake_gen2_filesystem_id": { "type": "string", "required": true, "options": [] },
            "sql_administrator_login": { "type": "string", "required": true, "options": [] },
            "sql_administrator_login_password": { "type": "string", "required": true, "options": [] },
            "managed_virtual_network_enabled": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_application_insights",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "application_type": {
                "type": "string",
                "required": true,
                "options": ["web", "other", "java", "MobileCenter", "phone", "store", "ios", "android"]
            },
            "workspace_id": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_log_analytics_workspace",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "sku": {
                "type": "string",
                "required": false,
                "options": ["Free", "Standard", "Premium", "PerNode", "PerGB2018", "Standalone", "CapacityReservation"]
            },
            "retention_in_days": { "type": "number", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_machine_learning_workspace",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "application_insights_id": { "type": "string", "required": true, "options": [] },
            "key_vault_id": { "type": "string", "required": true, "options": [] },
            "storage_account_id": { "type": "string", "required": true, "options": [] },
            "identity": {
                "type": "map",
                "required": true,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["SystemAssigned"]
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_batch_account",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "pool_allocation_mode": {
                "type": "string",
                "required": false,
                "options": ["BatchService", "UserSubscription"]
            },
            "storage_account_id": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_batch_pool",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "account_name": { "type": "string", "required": true, "options": [] },
            "vm_size": { "type": "string", "required": true, "options": [] },
            "storage_image_reference": {
                "type": "map",
                "required": true,
                "properties": {
                    "publisher": { "type": "string", "required": true },
                    "offer": { "type": "string", "required": true },
                    "sku": { "type": "string", "required": true },
                    "version": { "type": "string", "required": true }
                }
            },
            "node_agent_sku_id": { "type": "string", "required": true, "options": [] },
            "fixed_scale": {
                "type": "map",
                "required": false,
                "properties": {
                    "target_dedicated_nodes": { "type": "number", "required": false },
                    "resize_timeout": { "type": "string", "required": false }
                }
            },
            "auto_scale": {
                "type": "map",
                "required": false,
                "properties": {
                    "evaluation_interval": { "type": "string", "required": false },
                    "formula": { "type": "string", "required": true }
                }
            }
        }
    },
    {
        "type": "azurerm_automation_account",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "sku_name": {
                "type": "string",
                "required": true,
                "options": ["Basic", "Free"]
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_managed_disk",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "storage_account_type": {
                "type": "string",
                "required": true,
                "options": ["Standard_LRS", "Premium_LRS", "StandardSSD_LRS", "UltraSSD_LRS"]
            },
            "create_option": {
                "type": "string",
                "required": true,
                "options": ["Empty", "Import", "Copy", "FromImage", "Restore"]
            },
            "disk_size_gb": { "type": "number", "required": false, "options": [] },
            "zones": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_frontdoor",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "enforce_backend_pools_certificate_name_check": { "type": "bool", "required": true, "options": [] },
            "backend_pool": {
                "type": "list",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "backend": {
                        "type": "list",
                        "required": true,
                        "properties": {
                            "host_header": { "type": "string", "required": true },
                            "address": { "type": "string", "required": true },
                            "http_port": { "type": "number", "required": true },
                            "https_port": { "type": "number", "required": true },
                            "priority": { "type": "number", "required": false },
                            "weight": { "type": "number", "required": false }
                        }
                    },
                    "load_balancing_name": { "type": "string", "required": true },
                    "health_probe_name": { "type": "string", "required": true }
                }
            },
            "backend_pool_health_probe": {
                "type": "list",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "protocol": {
                        "type": "string",
                        "required": true,
                        "options": ["Http", "Https"]
                    },
                    "path": { "type": "string", "required": false }
                }
            },
            "backend_pool_load_balancing": {
                "type": "list",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "sample_size": { "type": "number", "required": false },
                    "successful_samples_required": { "type": "number", "required": false }
                }
            },
            "frontend_endpoint": {
                "type": "list",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "host_name": { "type": "string", "required": true },
                    "session_affinity_enabled": { "type": "bool", "required": false },
                    "session_affinity_ttl_seconds": { "type": "number", "required": false }
                }
            },
            "routing_rule": {
                "type": "list",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "accepted_protocols": {
                        "type": "list",
                        "required": true,
                        "options": ["Http", "Https"]
                    },
                    "patterns_to_match": { "type": "list", "required": true },
                    "frontend_endpoints": { "type": "list", "required": true },
                    "forwarding_configuration": {
                        "type": "map",
                        "required": false,
                        "properties": {
                            "backend_pool_name": { "type": "string", "required": true },
                            "cache_enabled": { "type": "bool", "required": false }
                        }
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_api_management",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "publisher_name": { "type": "string", "required": true, "options": [] },
            "publisher_email": { "type": "string", "required": true, "options": [] },
            "sku_name": {
                "type": "string",
                "required": true,
                "options": ["Consumption", "Developer", "Basic", "Standard", "Premium"]
            },
            "identity": {
                "type": "map",
                "required": false,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["SystemAssigned", "UserAssigned"]
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_api_management_api",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "api_management_name": { "type": "string", "required": true, "options": [] },
            "revision": { "type": "string", "required": true, "options": [] },
            "display_name": { "type": "string", "required": true, "options": [] },
            "path": { "type": "string", "required": true, "options": [] },
            "protocols": {
                "type": "list",
                "required": true,
                "options": ["http", "https"]
            },
            "service_url": { "type": "string", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_iot_hub",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "sku": {
                "type": "map",
                "required": true,
                "properties": {
                    "name": {
                        "type": "string",
                        "required": true,
                        "options": ["F1", "S1", "S2", "S3"]
                    },
                    "capacity": { "type": "number", "required": true }
                }
            },
            "endpoint": {
                "type": "list",
                "required": false,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["AzureIotHub.StorageContainer", "AzureIotHub.ServiceBusQueue", "AzureIotHub.ServiceBusTopic", "AzureIotHub.EventHub"]
                    },
                    "connection_string": { "type": "string", "required": true }
                }
            },
            "route": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "source": {
                        "type": "string",
                        "required": true,
                        "options": ["DeviceMessages", "TwinChangeEvents", "DeviceLifecycleEvents", "DeviceJobLifecycleEvents"]
                    },
                    "condition": { "type": "string", "required": false },
                    "endpoint_names": { "type": "list", "required": true },
                    "enabled": { "type": "bool", "required": true }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_stream_analytics_job",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "streaming_units": { "type": "number", "required": true, "options": [] },
            "transformation_query": { "type": "string", "required": true, "options": [] },
            "compatibility_level": {
                "type": "string",
                "required": false,
                "options": ["1.0", "1.1", "1.2"]
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_signalr_service",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "sku": {
                "type": "map",
                "required": true,
                "properties": {
                    "name": {
                        "type": "string",
                        "required": true,
                        "options": ["Free_F1", "Standard_S1"]
                    },
                    "capacity": { "type": "number", "required": true }
                }
            },
            "service_mode": {
                "type": "string",
                "required": false,
                "options": ["Default", "Serverless", "Classic"]
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azurerm_purview_account",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "location": { "type": "string", "required": true, "options": [] },
            "resource_group_name": { "type": "string", "required": true, "options": [] },
            "identity": {
                "type": "map",
                "required": true,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["SystemAssigned"]
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "azuread_application",
        "properties": {
            "display_name": { "type": "string", "required": true, "options": [] },
            "identifier_uris": { "type": "list", "required": false, "options": [] },
            "sign_in_audience": {
                "type": "string",
                "required": false,
                "options": ["AzureADMyOrg", "AzureADMultipleOrgs", "AzureADandPersonalMicrosoftAccount", "PersonalMicrosoftAccount"]
            },
            "web": {
                "type": "map",
                "required": false,
                "properties": {
                    "homepage_url": { "type": "string", "required": false },
                    "logout_url": { "type": "string", "required": false },
                    "redirect_uris": { "type": "list", "required": false },
                    "implicit_grant": {
                        "type": "map",
                        "required": false,
                        "properties": {
                            "access_token_issuance_enabled": { "type": "bool", "required": false },
                            "id_token_issuance_enabled": { "type": "bool", "required": false }
                        }
                    }
                }
            },
            "api": {
                "type": "map",
                "required": false,
                "properties": {
                    "mapped_claims_enabled": { "type": "bool", "required": false },
                    "requested_access_token_version": { "type": "number", "required": false },
                    "oauth2_permission_scope": {
                        "type": "list",
                        "required": false,
                        "properties": {
                            "admin_consent_description": { "type": "string", "required": true },
                            "admin_consent_display_name": { "type": "string", "required": true },
                            "id": { "type": "string", "required": true },
                            "enabled": { "type": "bool", "required": true },
                            "type": {
                                "type": "string",
                                "required": true,
                                "options": ["Admin", "User"]
                            },
                            "user_consent_description": { "type": "string", "required": false },
                            "user_consent_display_name": { "type": "string", "required": false },
                            "value": { "type": "string", "required": true }
                        }
                    }
                }
            },
            "app_role": {
                "type": "list",
                "required": false,
                "properties": {
                    "allowed_member_types": {
                        "type": "list",
                        "required": true,
                        "options": ["User", "Application"]
                    },
                    "description": { "type": "string", "required": true },
                    "display_name": { "type": "string", "required": true },
                    "id": { "type": "string", "required": true },
                    "enabled": { "type": "bool", "required": true },
                    "value": { "type": "string", "required": false }
                }
            },
            "required_resource_access": {
                "type": "list",
                "required": false,
                "properties": {
                    "resource_app_id": { "type": "string", "required": true },
                    "resource_access": {
                        "type": "list",
                        "required": true,
                        "properties": {
                            "id": { "type": "string", "required": true },
                            "type": {
                                "type": "string",
                                "required": true,
                                "options": ["Role", "Scope"]
                            }
                        }
                    }
                }
            },
            "owners": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "list", "required": false, "options": [] }
        }
    },
    {
        "type": "azuread_service_principal",
        "properties": {
            "application_id": { "type": "string", "required": true, "options": [] },
            "app_role_assignment_required": { "type": "bool", "required": false, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "feature_tags": {
                "type": "list",
                "required": false,
                "properties": {
                    "custom_single_sign_on": { "type": "bool", "required": false },
                    "enterprise": { "type": "bool", "required": false },
                    "gallery": { "type": "bool", "required": false },
                    "hide": { "type": "bool", "required": false }
                }
            },
            "login_url": { "type": "string", "required": false, "options": [] },
            "notes": { "type": "string", "required": false, "options": [] },
            "notification_email_addresses": { "type": "list", "required": false, "options": [] },
            "owners": { "type": "list", "required": false, "options": [] },
            "preferred_single_sign_on_mode": {
                "type": "string",
                "required": false,
                "options": ["saml", "password", "linked", "oidc"]
            },
            "tags": { "type": "list", "required": false, "options": [] },
            "use_existing": { "type": "bool", "required": false, "options": [] }
        }
    },
    {
        "type": "azuread_user",
        "properties": {
            "user_principal_name": { "type": "string", "required": true, "options": [] },
            "display_name": { "type": "string", "required": true, "options": [] },
            "mail_nickname": { "type": "string", "required": true, "options": [] },
            "password": { "type": "string", "required": true, "options": [] },
            "account_enabled": { "type": "bool", "required": false, "options": [] },
            "age_group": {
                "type": "string",
                "required": false,
                "options": ["Undefined", "Minor", "NotAdult", "Adult"]
            },
            "business_phones": { "type": "list", "required": false, "options": [] },
            "city": { "type": "string", "required": false, "options": [] },
            "company_name": { "type": "string", "required": false, "options": [] },
            "consent_provided_for_minor": {
                "type": "string",
                "required": false,
                "options": ["Undefined", "Granted", "Denied", "NotRequired"]
            },
            "country": { "type": "string", "required": false, "options": [] },
            "department": { "type": "string", "required": false, "options": [] },
            "force_password_change": { "type": "bool", "required": false, "options": [] },
            "given_name": { "type": "string", "required": false, "options": [] },
            "job_title": { "type": "string", "required": false, "options": [] },
            "mail": { "type": "string", "required": false, "options": [] },
            "mobile_phone": { "type": "string", "required": false, "options": [] },
            "office_location": { "type": "string", "required": false, "options": [] },
            "onpremises_immutable_id": { "type": "string", "required": false, "options": [] },
            "postal_code": { "type": "string", "required": false, "options": [] },
            "preferred_language": { "type": "string", "required": false, "options": [] },
            "state": { "type": "string", "required": false, "options": [] },
            "street_address": { "type": "string", "required": false, "options": [] },
            "surname": { "type": "string", "required": false, "options": [] },
            "usage_location": { "type": "string", "required": false, "options": [] }
        }
    },
    {
        "type": "azuread_group",
        "properties": {
            "display_name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "mail_enabled": { "type": "bool", "required": false, "options": [] },
            "mail_nickname": { "type": "string", "required": false, "options": [] },
            "security_enabled": { "type": "bool", "required": true, "options": [] },
            "types": {
                "type": "list",
                "required": false,
                "options": ["DynamicMembership", "Unified"]
            },
            "visibility": {
                "type": "string",
                "required": false,
                "options": ["Private", "Public", "HiddenMembership"]
            },
            "dynamic_membership": {
                "type": "map",
                "required": false,
                "properties": {
                    "enabled": { "type": "bool", "required": true },
                    "rule": { "type": "string", "required": true }
                }
            },
            "members": { "type": "list", "required": false, "options": [] },
            "owners": { "type": "list", "required": false, "options": [] }
        }
    },
    {
        "type": "azuread_conditional_access_policy",
        "properties": {
            "display_name": { "type": "string", "required": true, "options": [] },
            "state": {
                "type": "string",
                "required": true,
                "options": ["enabled", "disabled", "enabledForReportingButNotEnforced"]
            },
            "conditions": {
                "type": "map",
                "required": true,
                "properties": {
                    "applications": {
                        "type": "map",
                        "required": true,
                        "properties": {
                            "included_applications": { "type": "list", "required": false },
                            "excluded_applications": { "type": "list", "required": false },
                            "include_user_actions": { "type": "list", "required": false }
                        }
                    },
                    "users": {
                        "type": "map",
                        "required": true,
                        "properties": {
                            "included_users": { "type": "list", "required": false },
                            "excluded_users": { "type": "list", "required": false },
                            "included_groups": { "type": "list", "required": false },
                            "excluded_groups": { "type": "list", "required": false },
                            "included_roles": { "type": "list", "required": false },
                            "excluded_roles": { "type": "list", "required": false }
                        }
                    },
                    "client_app_types": {
                        "type": "list",
                        "required": true,
                        "options": ["all", "browser", "mobileAppsAndDesktopClients", "exchangeActiveSync", "easSupported", "other"]
                    },
                    "locations": {
                        "type": "map",
                        "required": false,
                        "properties": {
                            "included_locations": { "type": "list", "required": false },
                            "excluded_locations": { "type": "list", "required": false }
                        }
                    },
                    "devices": {
                        "type": "map",
                        "required": false,
                        "properties": {
                            "include_devices": { "type": "list", "required": false },
                            "exclude_devices": { "type": "list", "required": false }
                        }
                    }
                }
            },
            "grant_controls": {
                "type": "map",
                "required": true,
                "properties": {
                    "operator": {
                        "type": "string",
                        "required": true,
                        "options": ["AND", "OR"]
                    },
                    "built_in_controls": {
                        "type": "list",
                        "required": false,
                        "options": [
                            "mfa", "approvedApplication", "compliantApplication",
                            "compliantDevice", "domainJoinedDevice", "passwordChange"
                        ]
                    },
                    "custom_authentication_factors": { "type": "list", "required": false },
                    "terms_of_use": { "type": "list", "required": false }
                }
            },
            "session_controls": {
                "type": "map",
                "required": false,
                "properties": {
                    "application_enforced_restrictions_enabled": { "type": "bool", "required": false },
                    "cloud_app_security_policy": {
                        "type": "string",
                        "required": false,
                        "options": ["monitorOnly", "blockDownloads", "unknownFutureValue"]
                    },
                    "persistent_browser_mode": {
                        "type": "string",
                        "required": false,
                        "options": ["always", "never"]
                    },
                    "sign_in_frequency": {
                        "type": "map",
                        "required": false,
                        "properties": {
                            "value": { "type": "number", "required": true },
                            "type": {
                                "type": "string",
                                "required": true,
                                "options": ["days", "hours", "minutes"]
                            },
                            "frequency_period": {
                                "type": "string",
                                "required": true,
                                "options": ["timeBased", "everyTime", "unknownFutureValue"]
                            }
                        }
                    }
                }
            }
        }
    },
    {
        "type": "azuread_application_password",
        "properties": {
            "application_object_id": { "type": "string", "required": true, "options": [] },
            "display_name": { "type": "string", "required": false, "options": [] },
            "end_date": { "type": "string", "required": false, "options": [] },
            "end_date_relative": { "type": "string", "required": false, "options": [] },
            "rotate_when_changed": { "type": "map", "required": false, "options": [] },
            "start_date": { "type": "string", "required": false, "options": [] }
        }
    },
    {
        "type": "azuread_service_principal_password",
        "properties": {
            "service_principal_id": { "type": "string", "required": true, "options": [] },
            "display_name": { "type": "string", "required": false, "options": [] },
            "end_date": { "type": "string", "required": false, "options": [] },
            "end_date_relative": { "type": "string", "required": false, "options": [] },
            "rotate_when_changed": { "type": "map", "required": false, "options": [] },
            "start_date": { "type": "string", "required": false, "options": [] }
        }
    },
    {
        "type": "azuread_application_certificate",
        "properties": {
            "application_object_id": { "type": "string", "required": true, "options": [] },
            "type": {
                "type": "string",
                "required": false,
                "options": ["AsymmetricX509Cert", "Symmetric"]
            },
            "encoding": {
                "type": "string",
                "required": false,
                "options": ["base64", "hex"]
            },
            "end_date": { "type": "string", "required": false, "options": [] },
            "end_date_relative": { "type": "string", "required": false, "options": [] },
            "key_id": { "type": "string", "required": false, "options": [] },
            "start_date": { "type": "string", "required": false, "options": [] },
            "value": { "type": "string", "required": true, "options": [] }
        }
    },
    {
        "type": "azuread_service_principal_certificate",
        "properties": {
            "service_principal_id": { "type": "string", "required": true, "options": [] },
            "type": {
                "type": "string",
                "required": false,
                "options": ["AsymmetricX509Cert", "Symmetric"]
            },
            "encoding": {
                "type": "string",
                "required": false,
                "options": ["base64", "hex"]
            },
            "end_date": { "type": "string", "required": false, "options": [] },
            "end_date_relative": { "type": "string", "required": false, "options": [] },
            "key_id": { "type": "string", "required": false, "options": [] },
            "start_date": { "type": "string", "required": false, "options": [] },
            "value": { "type": "string", "required": true, "options": [] }
        }
    },
    {
        "type": "azuread_claims_mapping_policy",
        "properties": {
            "display_name": { "type": "string", "required": true, "options": [] },
            "definition": { "type": "list", "required": true, "options": [] }
        }
    },
    {
        "type": "azuread_directory_role",
        "properties": {
            "display_name": { "type": "string", "required": true, "options": [] },
            "template_id": { "type": "string", "required": false, "options": [] },
            "description": { "type": "string", "required": false, "options": [] }
        }
    },
    {
        "type": "azuread_directory_role_assignment",
        "properties": {
            "role_id": { "type": "string", "required": true, "options": [] },
            "principal_object_id": { "type": "string", "required": true, "options": [] }
        }
    },
    {
        "type": "azuread_invitation",
        "properties": {
            "user_email_address": { "type": "string", "required": true, "options": [] },
            "redirect_url": { "type": "string", "required": true, "options": [] },
            "message": {
                "type": "map",
                "required": false,
                "properties": {
                    "additional_recipients": { "type": "list", "required": false },
                    "body": { "type": "string", "required": false },
                    "language": { "type": "string", "required": false }
                }
            },
            "user_display_name": { "type": "string", "required": false, "options": [] },
            "user_type": {
                "type": "string",
                "required": false,
                "options": ["Guest", "Member"]
            }
        }
    },
    {
        "type": "azuread_named_location",
        "properties": {
            "display_name": { "type": "string", "required": true, "options": [] },
            "country": {
                "type": "map",
                "required": false,
                "properties": {
                    "countries_and_regions": { "type": "list", "required": true },
                    "include_unknown_countries_and_regions": { "type": "bool", "required": false }
                }
            },
            "ip": {
                "type": "map",
                "required": false,
                "properties": {
                    "ip_ranges": { "type": "list", "required": true },
                    "trusted": { "type": "bool", "required": false }
                }
            }
        }
    },
    {
        "type": "azuread_administrative_unit",
        "properties": {
            "display_name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "members": { "type": "list", "required": false, "options": [] },
            "scoped_role_members": {
                "type": "list",
                "required": false,
                "properties": {
                    "role_object_id": { "type": "string", "required": true },
                    "member_object_id": { "type": "string", "required": true }
                }
            }
        }
    },
    {
        "type": "azuread_application_federated_identity_credential",
        "properties": {
            "application_object_id": { "type": "string", "required": true, "options": [] },
            "display_name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "audiences": { "type": "list", "required": true, "options": [] },
            "issuer": { "type": "string", "required": true, "options": [] },
            "subject": { "type": "string", "required": true, "options": [] }
        }
    },
    {
        "type": "azuread_authentication_strength_policy",
        "properties": {
            "display_name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "allowed_combinations": {
                "type": "list",
                "required": true,
                "options": [
                    "password", "voice", "hardwareOath", "softwareOath",
                    "sms", "fido2", "windowsHelloForBusiness", "x509Certificate"
                ]
            }
        }
    },
    {
        "type": "azuread_custom_directory_role",
        "properties": {
            "display_name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "enabled": { "type": "bool", "required": true, "options": [] },
            "permissions": {
                "type": "list",
                "required": true,
                "properties": {
                    "allowed_resource_actions": { "type": "list", "required": true }
                }
            },
            "version": { "type": "string", "required": true, "options": [] }
        }
    },
    {
        "type": "azuread_directory_role_member",
        "properties": {
            "role_object_id": { "type": "string", "required": true, "options": [] },
            "member_object_id": { "type": "string", "required": true, "options": [] }
        }
    },
    {
        "type": "azuread_group_member",
        "properties": {
            "group_object_id": { "type": "string", "required": true, "options": [] },
            "member_object_id": { "type": "string", "required": true, "options": [] }
        }
    }
];