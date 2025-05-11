export const AWS_Resources = [
    {
        "type": "aws_instance",
        "properties": {
            "ami": { "type": "string", "required": true, "options": [] },
            "instance_type": {
                "type": "string",
                "required": true,
                "options": [
                    "t2.nano", "t2.micro", "t2.small", "t2.medium", "t2.large", "t2.xlarge", "t2.2xlarge",
                    "t3.nano", "t3.micro", "t3.small", "t3.medium", "t3.large", "t3.xlarge", "t3.2xlarge",
                    "m5.large", "m5.xlarge", "m5.2xlarge", "m5.4xlarge", "m5.12xlarge", "m5.24xlarge",
                    "c5.large", "c5.xlarge", "c5.2xlarge", "c5.4xlarge", "c5.9xlarge", "c5.12xlarge", "c5.18xlarge", "c5.24xlarge",
                    "r5.large", "r5.xlarge", "r5.2xlarge", "r5.4xlarge", "r5.8xlarge", "r5.12xlarge", "r5.16xlarge", "r5.24xlarge"
                ]
            },
            "availability_zone": { "type": "string", "required": false, "options": [] },
            "subnet_id": { "type": "string", "required": false, "options": [] },
            "vpc_security_group_ids": { "type": "list", "required": false, "options": [] },
            "key_name": { "type": "string", "required": false, "options": [] },
            "monitoring": { "type": "bool", "required": false, "options": [] },
            "iam_instance_profile": { "type": "string", "required": false, "options": [] },
            "user_data": { "type": "string", "required": false, "options": [] },
            "root_block_device": {
                "type": "map",
                "required": false,
                "properties": {
                    "volume_size": { "type": "number", "required": false },
                    "volume_type": {
                        "type": "string",
                        "required": false,
                        "options": ["standard", "gp2", "gp3", "io1", "io2", "sc1", "st1"]
                    },
                    "delete_on_termination": { "type": "bool", "required": false }
                }
            },
            "ebs_block_device": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_s3_bucket",
        "properties": {
            "bucket": { "type": "string", "required": true, "options": [] },
            "acl": {
                "type": "string",
                "required": false,
                "options": ["private", "public-read", "public-read-write", "aws-exec-read", "authenticated-read", "log-delivery-write"]
            },
            "versioning": {
                "type": "map",
                "required": false,
                "properties": {
                    "enabled": { "type": "bool", "required": false }
                }
            },
            "server_side_encryption_configuration": {
                "type": "map",
                "required": false,
                "properties": {
                    "rule": {
                        "type": "map",
                        "properties": {
                            "apply_server_side_encryption_by_default": {
                                "type": "map",
                                "properties": {
                                    "sse_algorithm": {
                                        "type": "string",
                                        "options": ["AES256", "aws:kms"]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "website": { "type": "map", "required": false, "options": [] },
            "cors_rule": { "type": "list", "required": false, "options": [] },
            "logging": { "type": "map", "required": false, "options": [] },
            "lifecycle_rule": { "type": "list", "required": false, "options": [] },
            "policy": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_lambda_function",
        "properties": {
            "function_name": { "type": "string", "required": true, "options": [] },
            "handler": { "type": "string", "required": true, "options": [] },
            "runtime": {
                "type": "string",
                "required": true,
                "options": [
                    "nodejs12.x", "nodejs14.x", "nodejs16.x", "nodejs18.x",
                    "python3.7", "python3.8", "python3.9", "python3.10",
                    "ruby2.7", "ruby3.2",
                    "java8", "java8.al2", "java11",
                    "go1.x",
                    "dotnetcore3.1", "dotnet6",
                    "provided", "provided.al2"
                ]
            },
            "filename": { "type": "string", "required": false, "options": [] },
            "s3_bucket": { "type": "string", "required": false, "options": [] },
            "s3_key": { "type": "string", "required": false, "options": [] },
            "role": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "memory_size": { "type": "number", "required": false, "options": [] },
            "timeout": { "type": "number", "required": false, "options": [] },
            "environment": { "type": "map", "required": false, "options": [] },
            "vpc_config": { "type": "map", "required": false, "options": [] },
            "layers": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_db_instance",
        "properties": {
            "engine": {
                "type": "string",
                "required": true,
                "options": ["mysql", "postgres", "oracle-ee", "sqlserver-ee", "mariadb", "aurora", "aurora-mysql", "aurora-postgresql"]
            },
            "engine_version": { "type": "string", "required": false, "options": [] },
            "instance_class": {
                "type": "string",
                "required": true,
                "options": [
                    "db.t2.micro", "db.t2.small", "db.t2.medium", "db.t2.large",
                    "db.t3.micro", "db.t3.small", "db.t3.medium", "db.t3.large", "db.t3.xlarge", "db.t3.2xlarge",
                    "db.m5.large", "db.m5.xlarge", "db.m5.2xlarge", "db.m5.4xlarge", "db.m5.12xlarge", "db.m5.24xlarge",
                    "db.r5.large", "db.r5.xlarge", "db.r5.2xlarge", "db.r5.4xlarge", "db.r5.12xlarge", "db.r5.24xlarge"
                ]
            },
            "allocated_storage": { "type": "number", "required": true, "options": [] },
            "storage_type": {
                "type": "string",
                "required": false,
                "options": ["standard", "gp2", "gp3", "io1"]
            },
            "username": { "type": "string", "required": true, "options": [] },
            "password": { "type": "string", "required": false, "options": [] },
            "db_name": { "type": "string", "required": false, "options": [] },
            "parameter_group_name": { "type": "string", "required": false, "options": [] },
            "availability_zone": { "type": "string", "required": false, "options": [] },
            "multi_az": { "type": "bool", "required": false, "options": [] },
            "publicly_accessible": { "type": "bool", "required": false, "options": [] },
            "vpc_security_group_ids": { "type": "list", "required": false, "options": [] },
            "backup_retention_period": { "type": "number", "required": false, "options": [] },
            "backup_window": { "type": "string", "required": false, "options": [] },
            "maintenance_window": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_vpc",
        "properties": {
            "cidr_block": { "type": "string", "required": true, "options": [] },
            "instance_tenancy": {
                "type": "string",
                "required": false,
                "options": ["default", "dedicated"]
            },
            "enable_dns_support": { "type": "bool", "required": false, "options": [] },
            "enable_dns_hostnames": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_subnet",
        "properties": {
            "vpc_id": { "type": "string", "required": true, "options": [] },
            "cidr_block": { "type": "string", "required": true, "options": [] },
            "availability_zone": { "type": "string", "required": false, "options": [] },
            "map_public_ip_on_launch": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_security_group",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": true, "options": [] },
            "vpc_id": { "type": "string", "required": false, "options": [] },
            "ingress": {
                "type": "list",
                "required": false,
                "properties": {
                    "from_port": { "type": "number", "required": true },
                    "to_port": { "type": "number", "required": true },
                    "protocol": {
                        "type": "string",
                        "required": true,
                        "options": ["tcp", "udp", "icmp", "all", "-1"]
                    },
                    "cidr_blocks": { "type": "list", "required": false },
                    "security_groups": { "type": "list", "required": false }
                }
            },
            "egress": {
                "type": "list",
                "required": false,
                "properties": {
                    "from_port": { "type": "number", "required": true },
                    "to_port": { "type": "number", "required": true },
                    "protocol": {
                        "type": "string",
                        "required": true,
                        "options": ["tcp", "udp", "icmp", "all", "-1"]
                    },
                    "cidr_blocks": { "type": "list", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_iam_role",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "assume_role_policy": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "path": { "type": "string", "required": false, "options": [] },
            "max_session_duration": { "type": "number", "required": false, "options": [] },
            "permissions_boundary": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_route53_record",
        "properties": {
            "zone_id": { "type": "string", "required": true, "options": [] },
            "name": { "type": "string", "required": true, "options": [] },
            "type": {
                "type": "string",
                "required": true,
                "options": ["A", "AAAA", "CNAME", "MX", "NS", "PTR", "SOA", "SPF", "SRV", "TXT"]
            },
            "ttl": { "type": "number", "required": false, "options": [] },
            "records": { "type": "list", "required": false, "options": [] },
            "alias": {
                "type": "map",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "zone_id": { "type": "string", "required": true },
                    "evaluate_target_health": { "type": "bool", "required": false }
                }
            }
        }
    },
    {
        "type": "aws_cloudfront_distribution",
        "properties": {
            "enabled": { "type": "bool", "required": true, "options": [] },
            "comment": { "type": "string", "required": false, "options": [] },
            "default_root_object": { "type": "string", "required": false, "options": [] },
            "price_class": {
                "type": "string",
                "required": false,
                "options": ["PriceClass_100", "PriceClass_200", "PriceClass_All"]
            },
            "aliases": { "type": "list", "required": false, "options": [] },
            "origins": {
                "type": "list",
                "required": true,
                "properties": {
                    "domain_name": { "type": "string", "required": true },
                    "origin_id": { "type": "string", "required": true },
                    "custom_origin_config": {
                        "type": "map",
                        "required": false,
                        "properties": {
                            "http_port": { "type": "number", "required": true },
                            "https_port": { "type": "number", "required": true },
                            "origin_protocol_policy": {
                                "type": "string",
                                "required": true,
                                "options": ["http-only", "match-viewer", "https-only"]
                            },
                            "origin_ssl_protocols": { "type": "list", "required": true }
                        }
                    }
                }
            },
            "default_cache_behavior": {
                "type": "map",
                "required": true,
                "properties": {
                    "allowed_methods": { "type": "list", "required": true },
                    "cached_methods": { "type": "list", "required": true },
                    "target_origin_id": { "type": "string", "required": true },
                    "viewer_protocol_policy": {
                        "type": "string",
                        "required": true,
                        "options": ["allow-all", "https-only", "redirect-to-https"]
                    },
                    "min_ttl": { "type": "number", "required": false },
                    "default_ttl": { "type": "number", "required": false },
                    "max_ttl": { "type": "number", "required": false }
                }
            },
            "restrictions": {
                "type": "map",
                "required": true,
                "properties": {
                    "geo_restriction": {
                        "type": "map",
                        "properties": {
                            "restriction_type": {
                                "type": "string",
                                "required": true,
                                "options": ["none", "whitelist", "blacklist"]
                            },
                            "locations": { "type": "list", "required": false }
                        }
                    }
                }
            },
            "viewer_certificate": {
                "type": "map",
                "required": true,
                "properties": {
                    "cloudfront_default_certificate": { "type": "bool", "required": false },
                    "acm_certificate_arn": { "type": "string", "required": false },
                    "ssl_support_method": {
                        "type": "string",
                        "required": false,
                        "options": ["sni-only", "vip"]
                    },
                    "minimum_protocol_version": {
                        "type": "string",
                        "required": false,
                        "options": ["SSLv3", "TLSv1", "TLSv1_2016", "TLSv1.1_2016", "TLSv1.2_2018", "TLSv1.2_2019"]
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_api_gateway_rest_api",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "binary_media_types": { "type": "list", "required": false, "options": [] },
            "minimum_compression_size": { "type": "number", "required": false, "options": [] },
            "endpoint_configuration": {
                "type": "map",
                "required": false,
                "properties": {
                    "types": {
                        "type": "list",
                        "required": true,
                        "options": ["EDGE", "REGIONAL", "PRIVATE"]
                    }
                }
            },
            "policy": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_dynamodb_table",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "hash_key": { "type": "string", "required": true, "options": [] },
            "range_key": { "type": "string", "required": false, "options": [] },
            "billing_mode": {
                "type": "string",
                "required": false,
                "options": ["PROVISIONED", "PAY_PER_REQUEST"]
            },
            "read_capacity": { "type": "number", "required": false, "options": [] },
            "write_capacity": { "type": "number", "required": false, "options": [] },
            "attribute": {
                "type": "list",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["S", "N", "B"]
                    }
                }
            },
            "global_secondary_index": { "type": "list", "required": false, "options": [] },
            "local_secondary_index": { "type": "list", "required": false, "options": [] },
            "server_side_encryption": {
                "type": "map",
                "required": false,
                "properties": {
                    "enabled": { "type": "bool", "required": true }
                }
            },
            "ttl": {
                "type": "map",
                "required": false,
                "properties": {
                    "enabled": { "type": "bool", "required": true },
                    "attribute_name": { "type": "string", "required": true }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_ecs_cluster",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "capacity_providers": { "type": "list", "required": false, "options": [] },
            "setting": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": {
                        "type": "string",
                        "required": true,
                        "options": ["containerInsights"]
                    },
                    "value": { "type": "string", "required": true }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_ecs_task_definition",
        "properties": {
            "family": { "type": "string", "required": true, "options": [] },
            "container_definitions": { "type": "string", "required": true, "options": [] },
            "task_role_arn": { "type": "string", "required": false, "options": [] },
            "execution_role_arn": { "type": "string", "required": false, "options": [] },
            "network_mode": {
                "type": "string",
                "required": false,
                "options": ["bridge", "host", "awsvpc", "none"]
            },
            "cpu": { "type": "string", "required": false, "options": [] },
            "memory": { "type": "string", "required": false, "options": [] },
            "requires_compatibilities": { "type": "list", "required": false, "options": [] },
            "volume": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_eks_cluster",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "role_arn": { "type": "string", "required": true, "options": [] },
            "version": { "type": "string", "required": false, "options": [] },
            "vpc_config": {
                "type": "list",
                "required": true,
                "properties": {
                    "subnet_ids": { "type": "list", "required": true },
                    "security_group_ids": { "type": "list", "required": false },
                    "endpoint_private_access": { "type": "bool", "required": false },
                    "endpoint_public_access": { "type": "bool", "required": false }
                }
            },
            "kubernetes_network_config": {
                "type": "map",
                "required": false,
                "properties": {
                    "service_ipv4_cidr": { "type": "string", "required": false }
                }
            },
            "enabled_cluster_log_types": {
                "type": "list",
                "required": false,
                "options": ["api", "audit", "authenticator", "controllerManager", "scheduler"]
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_elasticache_cluster",
        "properties": {
            "cluster_id": { "type": "string", "required": true, "options": [] },
            "engine": {
                "type": "string",
                "required": true,
                "options": ["redis", "memcached"]
            },
            "engine_version": { "type": "string", "required": false, "options": [] },
            "node_type": { "type": "string", "required": true, "options": [] },
            "num_cache_nodes": { "type": "number", "required": true, "options": [] },
            "parameter_group_name": { "type": "string", "required": false, "options": [] },
            "port": { "type": "number", "required": false, "options": [] },
            "subnet_group_name": { "type": "string", "required": false, "options": [] },
            "security_group_ids": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_kinesis_stream",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "shard_count": { "type": "number", "required": true, "options": [] },
            "retention_period": { "type": "number", "required": false, "options": [] },
            "shard_level_metrics": {
                "type": "list",
                "required": false,
                "options": [
                    "IncomingBytes", "IncomingRecords", "OutgoingBytes",
                    "OutgoingRecords", "WriteProvisionedThroughputExceeded",
                    "ReadProvisionedThroughputExceeded", "IteratorAgeMilliseconds"
                ]
            },
            "encryption_type": {
                "type": "string",
                "required": false,
                "options": ["NONE", "KMS"]
            },
            "kms_key_id": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_sns_topic",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "display_name": { "type": "string", "required": false, "options": [] },
            "policy": { "type": "string", "required": false, "options": [] },
            "delivery_policy": { "type": "string", "required": false, "options": [] },
            "kms_master_key_id": { "type": "string", "required": false, "options": [] },
            "fifo_topic": { "type": "bool", "required": false, "options": [] },
            "content_based_deduplication": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_sqs_queue",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "delay_seconds": { "type": "number", "required": false, "options": [] },
            "max_message_size": { "type": "number", "required": false, "options": [] },
            "message_retention_seconds": { "type": "number", "required": false, "options": [] },
            "receive_wait_time_seconds": { "type": "number", "required": false, "options": [] },
            "visibility_timeout_seconds": { "type": "number", "required": false, "options": [] },
            "policy": { "type": "string", "required": false, "options": [] },
            "redrive_policy": { "type": "string", "required": false, "options": [] },
            "fifo_queue": { "type": "bool", "required": false, "options": [] },
            "content_based_deduplication": { "type": "bool", "required": false, "options": [] },
            "kms_master_key_id": { "type": "string", "required": false, "options": [] },
            "kms_data_key_reuse_period_seconds": { "type": "number", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_rds_cluster",
        "properties": {
            "cluster_identifier": { "type": "string", "required": true, "options": [] },
            "engine": {
                "type": "string",
                "required": true,
                "options": ["aurora", "aurora-mysql", "aurora-postgresql"]
            },
            "engine_version": { "type": "string", "required": false, "options": [] },
            "availability_zones": { "type": "list", "required": false, "options": [] },
            "database_name": { "type": "string", "required": false, "options": [] },
            "master_username": { "type": "string", "required": true, "options": [] },
            "master_password": { "type": "string", "required": false, "options": [] },
            "backup_retention_period": { "type": "number", "required": false, "options": [] },
            "preferred_backup_window": { "type": "string", "required": false, "options": [] },
            "preferred_maintenance_window": { "type": "string", "required": false, "options": [] },
            "port": { "type": "number", "required": false, "options": [] },
            "vpc_security_group_ids": { "type": "list", "required": false, "options": [] },
            "db_subnet_group_name": { "type": "string", "required": false, "options": [] },
            "db_cluster_parameter_group_name": { "type": "string", "required": false, "options": [] },
            "storage_encrypted": { "type": "bool", "required": false, "options": [] },
            "kms_key_id": { "type": "string", "required": false, "options": [] },
            "enable_http_endpoint": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_cloudwatch_event_rule",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "schedule_expression": { "type": "string", "required": false, "options": [] },
            "event_pattern": { "type": "string", "required": false, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "role_arn": { "type": "string", "required": false, "options": [] },
            "is_enabled": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_cloudwatch_event_target",
        "properties": {
            "rule": { "type": "string", "required": true, "options": [] },
            "target_id": { "type": "string", "required": false, "options": [] },
            "arn": { "type": "string", "required": true, "options": [] },
            "input": { "type": "string", "required": false, "options": [] },
            "input_path": { "type": "string", "required": false, "options": [] },
            "role_arn": { "type": "string", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_cloudwatch_log_group",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "retention_in_days": {
                "type": "number",
                "required": false,
                "options": [1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653]
            },
            "kms_key_id": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_ecr_repository",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "image_tag_mutability": {
                "type": "string",
                "required": false,
                "options": ["MUTABLE", "IMMUTABLE"]
            },
            "image_scanning_configuration": {
                "type": "map",
                "required": false,
                "properties": {
                    "scan_on_push": { "type": "bool", "required": true }
                }
            },
            "encryption_configuration": {
                "type": "map",
                "required": false,
                "properties": {
                    "encryption_type": {
                        "type": "string",
                        "required": false,
                        "options": ["AES256", "KMS"]
                    },
                    "kms_key": { "type": "string", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_elastic_beanstalk_application",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "appversion_lifecycle": {
                "type": "map",
                "required": false,
                "properties": {
                    "service_role": { "type": "string", "required": true },
                    "max_count": { "type": "number", "required": false },
                    "delete_source_from_s3": { "type": "bool", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_glue_job",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "role_arn": { "type": "string", "required": true, "options": [] },
            "command": {
                "type": "map",
                "required": true,
                "properties": {
                    "name": { "type": "string", "required": false },
                    "script_location": { "type": "string", "required": true },
                    "python_version": { "type": "string", "required": false }
                }
            },
            "description": { "type": "string", "required": false, "options": [] },
            "glue_version": { "type": "string", "required": false, "options": [] },
            "max_capacity": { "type": "number", "required": false, "options": [] },
            "worker_type": {
                "type": "string",
                "required": false,
                "options": ["Standard", "G.1X", "G.2X"]
            },
            "number_of_workers": { "type": "number", "required": false, "options": [] },
            "timeout": { "type": "number", "required": false, "options": [] },
            "max_retries": { "type": "number", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_redshift_cluster",
        "properties": {
            "cluster_identifier": { "type": "string", "required": true, "options": [] },
            "node_type": {
                "type": "string",
                "required": true,
                "options": [
                    "ds2.xlarge", "ds2.8xlarge", "dc1.large", "dc1.8xlarge",
                    "dc2.large", "dc2.8xlarge", "ra3.xlplus", "ra3.4xlarge", "ra3.16xlarge"
                ]
            },
            "master_username": { "type": "string", "required": true, "options": [] },
            "master_password": { "type": "string", "required": true, "options": [] },
            "database_name": { "type": "string", "required": false, "options": [] },
            "cluster_type": {
                "type": "string",
                "required": false,
                "options": ["single-node", "multi-node"]
            },
            "number_of_nodes": { "type": "number", "required": false, "options": [] },
            "encrypted": { "type": "bool", "required": false, "options": [] },
            "kms_key_id": { "type": "string", "required": false, "options": [] },
            "enhanced_vpc_routing": { "type": "bool", "required": false, "options": [] },
            "publicly_accessible": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_efs_file_system",
        "properties": {
            "creation_token": { "type": "string", "required": false, "options": [] },
            "encrypted": { "type": "bool", "required": false, "options": [] },
            "kms_key_id": { "type": "string", "required": false, "options": [] },
            "performance_mode": {
                "type": "string",
                "required": false,
                "options": ["generalPurpose", "maxIO"]
            },
            "provisioned_throughput_in_mibps": { "type": "number", "required": false, "options": [] },
            "throughput_mode": {
                "type": "string",
                "required": false,
                "options": ["bursting", "provisioned"]
            },
            "lifecycle_policy": {
                "type": "map",
                "required": false,
                "properties": {
                    "transition_to_ia": { "type": "string", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_elasticsearch_domain",
        "properties": {
            "domain_name": { "type": "string", "required": true, "options": [] },
            "elasticsearch_version": { "type": "string", "required": false, "options": [] },
            "cluster_config": {
                "type": "map",
                "required": false,
                "properties": {
                    "instance_type": {
                        "type": "string",
                        "required": false,
                        "options": [
                            "m3.medium.elasticsearch", "m3.large.elasticsearch", "m3.xlarge.elasticsearch", "m3.2xlarge.elasticsearch",
                            "m4.large.elasticsearch", "m4.xlarge.elasticsearch", "m4.2xlarge.elasticsearch", "m4.4xlarge.elasticsearch", "m4.10xlarge.elasticsearch",
                            "t2.micro.elasticsearch", "t2.small.elasticsearch", "t2.medium.elasticsearch",
                            "r3.large.elasticsearch", "r3.xlarge.elasticsearch", "r3.2xlarge.elasticsearch", "r3.4xlarge.elasticsearch", "r3.8xlarge.elasticsearch",
                            "i2.xlarge.elasticsearch", "i2.2xlarge.elasticsearch",
                            "c4.large.elasticsearch", "c4.xlarge.elasticsearch", "c4.2xlarge.elasticsearch", "c4.4xlarge.elasticsearch", "c4.8xlarge.elasticsearch",
                            "r4.large.elasticsearch", "r4.xlarge.elasticsearch", "r4.2xlarge.elasticsearch", "r4.4xlarge.elasticsearch", "r4.8xlarge.elasticsearch", "r4.16xlarge.elasticsearch",
                            "i3.large.elasticsearch", "i3.xlarge.elasticsearch", "i3.2xlarge.elasticsearch", "i3.4xlarge.elasticsearch", "i3.8xlarge.elasticsearch", "i3.16xlarge.elasticsearch"
                        ]
                    },
                    "instance_count": { "type": "number", "required": false },
                    "dedicated_master_enabled": { "type": "bool", "required": false },
                    "zone_awareness_enabled": { "type": "bool", "required": false }
                }
            },
            "ebs_options": {
                "type": "map",
                "required": false,
                "properties": {
                    "ebs_enabled": { "type": "bool", "required": true },
                    "volume_type": {
                        "type": "string",
                        "required": false,
                        "options": ["standard", "gp2", "io1"]
                    },
                    "volume_size": { "type": "number", "required": false }
                }
            },
            "vpc_options": {
                "type": "map",
                "required": false,
                "properties": {
                    "security_group_ids": { "type": "list", "required": false },
                    "subnet_ids": { "type": "list", "required": false }
                }
            },
            "log_publishing_options": {
                "type": "map",
                "required": false,
                "properties": {
                    "cloudwatch_log_group_arn": { "type": "string", "required": true },
                    "log_type": {
                        "type": "string",
                        "required": true,
                        "options": ["INDEX_SLOW_LOGS", "SEARCH_SLOW_LOGS", "ES_APPLICATION_LOGS", "AUDIT_LOGS"]
                    }
                }
            },
            "advanced_options": { "type": "map", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_msk_cluster",
        "properties": {
            "cluster_name": { "type": "string", "required": true, "options": [] },
            "kafka_version": { "type": "string", "required": true, "options": [] },
            "number_of_broker_nodes": { "type": "number", "required": true, "options": [] },
            "broker_node_group_info": {
                "type": "map",
                "required": true,
                "properties": {
                    "instance_type": {
                        "type": "string",
                        "required": true,
                        "options": [
                            "kafka.m5.large", "kafka.m5.xlarge", "kafka.m5.2xlarge", "kafka.m5.4xlarge",
                            "kafka.m5.12xlarge", "kafka.m5.24xlarge"
                        ]
                    },
                    "client_subnets": { "type": "list", "required": true },
                    "security_groups": { "type": "list", "required": true },
                    "ebs_volume_size": { "type": "number", "required": true }
                }
            },
            "encryption_info": {
                "type": "map",
                "required": false,
                "properties": {
                    "encryption_at_rest_kms_key_arn": { "type": "string", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_wafv2_web_acl",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "scope": {
                "type": "string",
                "required": true,
                "options": ["CLOUDFRONT", "REGIONAL"]
            },
            "default_action": {
                "type": "map",
                "required": true,
                "properties": {
                    "allow": { "type": "map", "required": false },
                    "block": { "type": "map", "required": false }
                }
            },
            "visibility_config": {
                "type": "map",
                "required": true,
                "properties": {
                    "cloudwatch_metrics_enabled": { "type": "bool", "required": true },
                    "metric_name": { "type": "string", "required": true },
                    "sampled_requests_enabled": { "type": "bool", "required": true }
                }
            },
            "rule": {
                "type": "list",
                "required": false,
                "properties": {
                    "name": { "type": "string", "required": true },
                    "priority": { "type": "number", "required": true },
                    "action": {
                        "type": "map",
                        "required": false,
                        "properties": {
                            "allow": { "type": "map", "required": false },
                            "block": { "type": "map", "required": false },
                            "count": { "type": "map", "required": false }
                        }
                    },
                    "statement": { "type": "map", "required": true },
                    "visibility_config": {
                        "type": "map",
                        "required": true,
                        "properties": {
                            "cloudwatch_metrics_enabled": { "type": "bool", "required": true },
                            "metric_name": { "type": "string", "required": true },
                            "sampled_requests_enabled": { "type": "bool", "required": true }
                        }
                    }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_appsync_graphql_api",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "authentication_type": {
                "type": "string",
                "required": true,
                "options": ["API_KEY", "AWS_IAM", "AMAZON_COGNITO_USER_POOLS", "OPENID_CONNECT"]
            },
            "schema": { "type": "string", "required": false, "options": [] },
            "log_config": {
                "type": "map",
                "required": false,
                "properties": {
                    "field_log_level": {
                        "type": "string",
                        "required": true,
                        "options": ["NONE", "ERROR", "ALL"]
                    },
                    "cloudwatch_logs_role_arn": { "type": "string", "required": true }
                }
            },
            "user_pool_config": {
                "type": "map",
                "required": false,
                "properties": {
                    "user_pool_id": { "type": "string", "required": true },
                    "aws_region": { "type": "string", "required": false },
                    "default_action": {
                        "type": "string",
                        "required": true,
                        "options": ["ALLOW", "DENY"]
                    }
                }
            },
            "openid_connect_config": {
                "type": "map",
                "required": false,
                "properties": {
                    "issuer": { "type": "string", "required": true },
                    "client_id": { "type": "string", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_fsx_lustre_file_system",
        "properties": {
            "storage_capacity": { "type": "number", "required": true, "options": [] },
            "subnet_ids": { "type": "list", "required": true, "options": [] },
            "deployment_type": {
                "type": "string",
                "required": false,
                "options": ["SCRATCH_1", "SCRATCH_2", "PERSISTENT_1"]
            },
            "per_unit_storage_throughput": { "type": "number", "required": false, "options": [] },
            "automatic_backup_retention_days": { "type": "number", "required": false, "options": [] },
            "daily_automatic_backup_start_time": { "type": "string", "required": false, "options": [] },
            "storage_type": {
                "type": "string",
                "required": false,
                "options": ["SSD", "HDD"]
            },
            "kms_key_id": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_iot_topic_rule",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "enabled": { "type": "bool", "required": true, "options": [] },
            "sql": { "type": "string", "required": true, "options": [] },
            "sql_version": { "type": "string", "required": true, "options": [] },
            "error_action": { "type": "map", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_neptune_cluster",
        "properties": {
            "cluster_identifier": { "type": "string", "required": true, "options": [] },
            "engine": {
                "type": "string",
                "required": false,
                "options": ["neptune"]
            },
            "engine_version": { "type": "string", "required": false, "options": [] },
            "availability_zones": { "type": "list", "required": false, "options": [] },
            "backup_retention_period": { "type": "number", "required": false, "options": [] },
            "preferred_backup_window": { "type": "string", "required": false, "options": [] },
            "preferred_maintenance_window": { "type": "string", "required": false, "options": [] },
            "port": { "type": "number", "required": false, "options": [] },
            "vpc_security_group_ids": { "type": "list", "required": false, "options": [] },
            "storage_encrypted": { "type": "bool", "required": false, "options": [] },
            "kms_key_arn": { "type": "string", "required": false, "options": [] },
            "iam_roles": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_qldb_ledger",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "permissions_mode": {
                "type": "string",
                "required": true,
                "options": ["ALLOW_ALL", "STANDARD"]
            },
            "deletion_protection": { "type": "bool", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_service_discovery_service",
        "properties": {
            "name": { "type": "string", "required": true, "options": [] },
            "description": { "type": "string", "required": false, "options": [] },
            "dns_config": {
                "type": "map",
                "required": true,
                "properties": {
                    "namespace_id": { "type": "string", "required": true },
                    "dns_records": {
                        "type": "list",
                        "required": true,
                        "properties": {
                            "type": {
                                "type": "string",
                                "required": true,
                                "options": ["A", "AAAA", "SRV", "CNAME"]
                            },
                            "ttl": { "type": "number", "required": true }
                        }
                    }
                }
            },
            "health_check_config": {
                "type": "map",
                "required": false,
                "properties": {
                    "type": {
                        "type": "string",
                        "required": true,
                        "options": ["HTTP", "HTTPS", "TCP"]
                    },
                    "failure_threshold": { "type": "number", "required": false }
                }
            },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_transfer_server",
        "properties": {
            "endpoint_type": {
                "type": "string",
                "required": false,
                "options": ["PUBLIC", "VPC", "VPC_ENDPOINT"]
            },
            "protocols": {
                "type": "list",
                "required": false,
                "options": ["SFTP", "FTP", "FTPS"]
            },
            "certificate": { "type": "string", "required": false, "options": [] },
            "identity_provider_type": {
                "type": "string",
                "required": false,
                "options": ["SERVICE_MANAGED", "API_GATEWAY"]
            },
            "logging_role": { "type": "string", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    },
    {
        "type": "aws_workspaces_directory",
        "properties": {
            "directory_id": { "type": "string", "required": true, "options": [] },
            "subnet_ids": { "type": "list", "required": false, "options": [] },
            "tags": { "type": "map", "required": false, "options": [] }
        }
    }
];