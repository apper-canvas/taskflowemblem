import mockTasks from '@/services/mockData/tasks.json'

class TaskService {
  constructor() {
    this.tasks = [...mockTasks]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(task => task.Id === parseInt(id))
    return task ? { ...task } : null
  }

  async create(taskData) {
    await this.delay()
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      completed: false,
      archived: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) throw new Error('Task not found')
    
    if (updates.completed && !this.tasks[index].completed) {
      updates.completedAt = new Date().toISOString()
    } else if (!updates.completed) {
      updates.completedAt = null
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updates }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) throw new Error('Task not found')
    
    const deletedTask = { ...this.tasks[index] }
    this.tasks.splice(index, 1)
    return deletedTask
  }

  async markComplete(id) {
    return this.update(id, { completed: true })
  }

  async markIncomplete(id) {
    return this.update(id, { completed: false })
  }

  async archive(id) {
    return this.update(id, { archived: true })
  }

  async getActive() {
    await this.delay()
    return this.tasks.filter(task => !task.archived)
  }

  async getArchived() {
    await this.delay()
    return this.tasks.filter(task => task.archived)
  }

  async getByCategory(category) {
    await this.delay()
    return this.tasks.filter(task => task.category === category && !task.archived)
  }

  async search(query) {
    await this.delay()
    const lowercaseQuery = query.toLowerCase()
    return this.tasks.filter(task => 
      !task.archived && (
        task.title.toLowerCase().includes(lowercaseQuery) ||
        task.description.toLowerCase().includes(lowercaseQuery)
      )
    )
  }
}

export default new TaskService()