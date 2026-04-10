provider "aws" {
  region = var.aws_region
}

resource "aws_db_subnet_group" "devops_project" {
  name       = "devops-project-db-subnet-group"
  subnet_ids = var.db_subnet_ids

  tags = {
    Name    = "devops-project-db-subnet-group"
    Project = "devops-project"
  }
}

resource "aws_security_group" "rds" {
  name        = "devops-project-rds-sg"
  description = "Allow PostgreSQL access from backend service"
  vpc_id      = var.vpc_id

  ingress {
    description = "PostgreSQL from backend"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.backend_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "devops-project-rds-sg"
    Project = "devops-project"
  }
}

resource "aws_db_instance" "devops_project" {
  identifier           = "devops-project-db"
  engine               = "postgres"
  engine_version       = var.db_engine_version
  instance_class       = var.db_instance_class
  allocated_storage    = var.db_allocated_storage
  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.devops_project.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot  = var.db_skip_final_snapshot
  publicly_accessible  = false

  tags = {
    Name    = "devops-project-db"
    Project = "devops-project"
  }
}
