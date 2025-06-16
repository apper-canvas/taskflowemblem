import { toast } from 'react-toastify'

class TaskService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'category', 'priority', 'due_date', 'completed', 'archived', 'created_at', 'completed_at'],
        "orderBy": [
          {
            "FieldName": "created_at",
            "SortType": "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'category', 'priority', 'due_date', 'completed', 'archived', 'created_at', 'completed_at']
      };
      
      const response = await this.apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: taskData.Name || taskData.title,
          Tags: taskData.Tags || '',
          Owner: taskData.Owner,
          title: taskData.title,
          description: taskData.description || '',
          category: taskData.category,
          priority: taskData.priority,
          due_date: taskData.dueDate || taskData.due_date,
          completed: false,
          archived: false,
          created_at: new Date().toISOString(),
          completed_at: null
        }]
      };
      
      const response = await this.apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Handle completion timestamp
      if (updates.completed && updates.completed_at === undefined) {
        updates.completed_at = new Date().toISOString();
      } else if (updates.completed === false) {
        updates.completed_at = null;
      }
      
      // Only include Updateable fields
      const updateData = {};
      const updateableFields = ['Name', 'Tags', 'Owner', 'title', 'description', 'category', 'priority', 'due_date', 'completed', 'archived', 'created_at', 'completed_at'];
      
      Object.keys(updates).forEach(key => {
        if (updateableFields.includes(key)) {
          updateData[key] = updates[key];
        }
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await this.apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async markComplete(id) {
    return this.update(id, { completed: true });
  }

  async markIncomplete(id) {
    return this.update(id, { completed: false });
  }

  async archive(id) {
    return this.update(id, { archived: true });
  }

  async getActive() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'category', 'priority', 'due_date', 'completed', 'archived', 'created_at', 'completed_at'],
        "where": [
          {
            "FieldName": "archived",
            "Operator": "ExactMatch",
            "Values": [false]
          }
        ],
        "orderBy": [
          {
            "FieldName": "created_at",
            "SortType": "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching active tasks:", error);
      return [];
    }
  }

  async getArchived() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'category', 'priority', 'due_date', 'completed', 'archived', 'created_at', 'completed_at'],
        "where": [
          {
            "FieldName": "archived",
            "Operator": "ExactMatch",
            "Values": [true]
          }
        ],
        "orderBy": [
          {
            "FieldName": "created_at",
            "SortType": "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching archived tasks:", error);
      return [];
    }
  }

  async getByCategory(category) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'category', 'priority', 'due_date', 'completed', 'archived', 'created_at', 'completed_at'],
        "where": [
          {
            "FieldName": "category",
            "Operator": "ExactMatch",
            "Values": [category]
          },
          {
            "FieldName": "archived",
            "Operator": "ExactMatch",
            "Values": [false]
          }
        ],
        "orderBy": [
          {
            "FieldName": "created_at",
            "SortType": "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      return [];
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'category', 'priority', 'due_date', 'completed', 'archived', 'created_at', 'completed_at'],
        "whereGroups": [
          {
            "operator": "OR",
            "SubGroups": [
              {
                "conditions": [
                  {
                    "FieldName": "title",
                    "Operator": "Contains",
                    "Values": [query]
                  }
                ],
                "operator": ""
              },
              {
                "conditions": [
                  {
                    "FieldName": "description",
                    "Operator": "Contains",
                    "Values": [query]
                  }
                ],
                "operator": ""
              }
            ]
          }
        ],
        "where": [
          {
            "FieldName": "archived",
            "Operator": "ExactMatch",
            "Values": [false]
          }
        ],
        "orderBy": [
          {
            "FieldName": "created_at",
            "SortType": "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      return [];
    }
  }
}

export default new TaskService()