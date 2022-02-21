

# Configure the LaunchDarkly provider
terraform {
  required_providers {
    launchdarkly = {
      source = "launchdarkly/launchdarkly"
      version = "~> 2.0.0"
    }
  }
  required_version = ">= 0.13"

}

provider "launchdarkly" {
  access_token = var.launchdarkly_access_token
  
}


resource "launchdarkly_project" "demoProject" {
  key  = var.launchdarkly_project_key
  name = var.launchdarkly_project_name

  tags  = ["managed-by-terraform"]
  
  environments {
        key   = var.launchdarkly_environment_key
        name  = var.launchdarkly_environment_name
        color = var.launchdarkly_environment_color
        tags  = ["managed-by-terraform"]
    }
}

resource "launchdarkly_feature_flag" "showBadge" {
  project_key = launchdarkly_project.demoProject.key
  key         = "show-badge"
  name        = "Show Badge"
  description = "Displays the liked button counter."
  variation_type = "boolean"

  variations {
    value = true
    name = "Show Badge"
  }
  variations {
    value = false
    name = "Hide Badge"
  }

  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags  = ["managed-by-terraform", "state-managed-by-terraform"]
  temporary= true
  include_in_snippet = true
}

resource "launchdarkly_feature_flag" "showLikeButton" {
  project_key = launchdarkly_project.demoProject.key
  key         = "show-like-button"
  name        = "Show Like Button"
  description = "Displays the like button."

  variation_type = "boolean"

  variations {
    value = true
    name = "Show Like button"
  }
  variations {
    value = false
    name = "Hide Like button"
  }

  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags  = ["managed-by-terraform"]
  temporary= true
  include_in_snippet = true
}
resource "launchdarkly_feature_flag" "getLauncherDetails" {
  project_key = launchdarkly_project.demoProject.key
  key         = "get-launcher-details"
  name        = "Get Launcher Details"
  description = "Get Launcher details"

  variation_type = "json"

  variations {
    value = jsonencode(
        {
            "heroName": "Light Launcher",
            "backgroundImage": "ThumbsUpLight.png",
            "heroImage": "ThumbsUpLight.png"
        }
    )
    name = "Light Launcher"
  }
 variations {
    value = jsonencode(
        {
            "heroName": "Dark Launcher",
            "backgroundImage": "ThumbsUpDark.png",
            "heroImage": "ThumbsUpDark.png"
        }
    )
    name = "Dark Launcher"
  }
 variations {
    value = jsonencode(
        {
           "heroName": "Toggle",
            "backgroundImage": "Toggle_Halloween_Dark.png",
            "heroImage": "Toggle_Halloween_Dark.png"
        }
    )
    name = "Toggle"
  }
  defaults {
    on_variation = 1
    off_variation = 2
  }

  tags = ["managed-by-terraform", "state-managed-by-terraform"]
  temporary= true
  include_in_snippet = true
}

resource "launchdarkly_feature_flag" "darkMode" {
  project_key = launchdarkly_project.demoProject.key
  key         = "dark-mode"
  name        = "Dark Mode"
  description = "Use dark barkground"

  variation_type = "boolean"

  variations {
    value = true
    name = "Enable dark mode"
  }
  variations {
    value = false
    name = "Disable dark mode"
  }

  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags  = ["managed-by-terraform"]
  temporary= true
  include_in_snippet = true
}

resource "launchdarkly_feature_flag" "showUIDebug" {
  project_key = launchdarkly_project.demoProject.key
  key         = "show-ui-debug"
  name        = "Show UI Debug"
  description = "Show debug detail"

  variation_type = "boolean"

  variations {
    value = true
    name = "Enable UI Debug"
  }
  variations {
    value = false
    name = "Disable UI Debug"
  }

  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags = ["managed-by-terraform", "state-managed-by-terraform"]
  temporary= true
  include_in_snippet = true
}
resource "launchdarkly_feature_flag_environment" "showBadge-prereq" {
  flag_id           = launchdarkly_feature_flag.showBadge.id
  env_key           = var.launchdarkly_environment_key
  on = true

  prerequisites {
    flag_key  = launchdarkly_feature_flag.showLikeButton.key
    variation = 0
  }

  fallthrough {
    variation = 0
  }
  off_variation = 1
}


resource "launchdarkly_feature_flag_environment" "getLauncherDetailsTarget" {
  flag_id           = launchdarkly_feature_flag.getLauncherDetails.id
  env_key           = var.launchdarkly_environment_key
  on = true
  track_events      = false

  rules {
    clauses {
      attribute = "group"
      op        = "contains"
      values    = ["Light"]
      
    }
    variation = 0
  }
  rules {
    clauses {
      attribute = "group"
      op        = "contains"
      values    = ["Dark"]
      
    }
    variation = 1
  }
  fallthrough {
   variation=2
  }
  off_variation = 2
}



resource "launchdarkly_feature_flag_environment" "showUIDebug" {
  flag_id           = launchdarkly_feature_flag.showUIDebug.id
  env_key           = var.launchdarkly_environment_key
  on = false
  track_events      = false

  fallthrough {
   variation=0
  }
  off_variation = 1
}
data "launchdarkly_environment" "environment" {
    depends_on=[launchdarkly_project.demoProject]
    project_key  = var.launchdarkly_project_key
    key   = var.launchdarkly_environment_key
    
}
